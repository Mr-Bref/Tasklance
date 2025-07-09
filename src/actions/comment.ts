"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher-server";

const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  taskId: z.string(),
});

const UpdateCommentSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Comment content is required"),
});

export async function createComment(input: z.infer<typeof CreateCommentSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const validated = CreateCommentSchema.safeParse(input);
  if (!validated.success) {
    throw new Error("Invalid comment data");
  }

  const { content, taskId } = validated.data;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get the project ID for real-time updates
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        state: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (task?.state.projectId) {
      // Trigger real-time update
      await pusherServer.trigger(
        `project-${task.state.projectId}`,
        "comment-created",
        {
          comment,
          taskId,
        }
      );
    }

    return comment;
  } catch (error) {
    console.error("Create comment failed:", error);
    throw new Error("Failed to create comment");
  }
}

export async function updateComment(input: z.infer<typeof UpdateCommentSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const validated = UpdateCommentSchema.safeParse(input);
  if (!validated.success) {
    throw new Error("Invalid comment data");
  }

  const { id, content } = validated.data;

  try {
    // Check if user owns the comment
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true, taskId: true },
    });

    if (!existingComment || existingComment.authorId !== user.id) {
      throw new Error("Unauthorized to edit this comment");
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get the project ID for real-time updates
    const task = await prisma.task.findUnique({
      where: { id: existingComment.taskId },
      select: {
        state: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (task?.state.projectId) {
      // Trigger real-time update
      await pusherServer.trigger(
        `project-${task.state.projectId}`,
        "comment-updated",
        {
          comment,
          taskId: existingComment.taskId,
        }
      );
    }

    return comment;
  } catch (error) {
    console.error("Update comment failed:", error);
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  try {
    // Check if user owns the comment
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, taskId: true },
    });

    if (!existingComment || existingComment.authorId !== user.id) {
      throw new Error("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Get the project ID for real-time updates
    const task = await prisma.task.findUnique({
      where: { id: existingComment.taskId },
      select: {
        state: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (task?.state.projectId) {
      // Trigger real-time update
      await pusherServer.trigger(
        `project-${task.state.projectId}`,
        "comment-deleted",
        {
          commentId,
          taskId: existingComment.taskId,
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Delete comment failed:", error);
    throw new Error("Failed to delete comment");
  }
}

export async function getTaskComments(taskId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Get comments failed:", error);
    throw new Error("Failed to fetch comments");
  }
}