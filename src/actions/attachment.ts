"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher-server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "text/csv",
];

export async function uploadTaskAttachment(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  const taskId = formData.get("taskId") as string;

  if (!file || !taskId) {
    throw new Error("File and task ID are required");
  }

  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 10MB limit");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("File type not allowed");
  }

  // Verify user has access to the task
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      state: {
        project: {
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      state: {
        select: {
          projectId: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  try {
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "attachments");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save attachment record to database
    const attachment = await prisma.attachment.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/attachments/${uniqueFilename}`,
        taskId,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(
      `project-${task.state.projectId}`,
      "attachment-uploaded",
      {
        attachment,
        taskId,
      }
    );

    return attachment;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteTaskAttachment(attachmentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  try {
    // Check if user owns the attachment or has project access
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: {
          include: {
            state: {
              include: {
                project: {
                  include: {
                    participants: {
                      where: {
                        userId: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        uploadedBy: true,
      },
    });

    if (!attachment) {
      throw new Error("Attachment not found");
    }

    // Check permissions (owner or project member with manager/admin role)
    const isOwner = attachment.uploadedById === user.id;
    const isProjectMember = attachment.task.state.project.participants.length > 0;
    const hasAccess = isOwner || isProjectMember;

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    // Delete file from filesystem
    try {
      const fs = require("fs").promises;
      const filePath = join(process.cwd(), "public", attachment.url);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error("Failed to delete file from filesystem:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete attachment record
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    // Trigger real-time update
    await pusherServer.trigger(
      `project-${attachment.task.state.project.id}`,
      "attachment-deleted",
      {
        attachmentId,
        taskId: attachment.taskId,
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Delete attachment failed:", error);
    throw new Error("Failed to delete attachment");
  }
}

export async function getTaskAttachments(taskId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  try {
    // Verify user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        state: {
          project: {
            participants: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error("Task not found or access denied");
    }

    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return attachments;
  } catch (error) {
    console.error("Get attachments failed:", error);
    throw new Error("Failed to fetch attachments");
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("sheet")) return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📑";
  if (mimeType.includes("zip")) return "📦";
  if (mimeType === "text/plain") return "📃";
  if (mimeType === "text/csv") return "📈";
  return "📎";
}