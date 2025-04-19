"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {prisma} from "@/lib/prisma"
import { z } from "zod";

type CreateTaskInput = {
  title: string
  description?: string
  dueDate: Date
  priority: "LOW" | "MEDIUM" | "HIGH"
  projectId: string
}

import { Status } from "@prisma/client";

// map lowercase strings to Prisma enums
const statusMap: Record<string, Status> = {
  todo: "TODO",
  inprogress: "IN_PROGRESS",
  completed: "COMPLETED",
  canceled: "CANCELED",
  reviewed: "REVIEWED",
};

export async function createTask(data: CreateTaskInput) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user) throw new Error("Unauthorized")

  const { title, description, dueDate, projectId, priority } = data

  if (!title?.trim()) throw new Error("Title is required")
  if (!dueDate) throw new Error("Due date is required")

  await prisma.task.create({
    data: {
      title,
      description :description || '',
      dueDate,
      projectId,
      priority,
    },
  })

}





export async function updateTaskStatus(taskId: string, status: string) {
  const prismaStatus = statusMap[status.toLowerCase()]; // handle casing safely

  if (!prismaStatus) throw new Error("Invalid status");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: prismaStatus },
    select: { projectId: true },
  });

  return updatedTask.projectId;
}


export async function deleteTask(id: string): Promise<string> {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { projectId: true },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.delete({
    where: { id },
  });

  return task.projectId;
}




const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "inprogress", "completed", "canceled", "reviewed"]),
  dueDate: z.date(),
});


export async function updateTask(input: z.infer<typeof UpdateTaskSchema>) {
  const validated = UpdateTaskSchema.safeParse(input);
  if (!validated.success) {
    console.error(validated.error);
    throw new Error("Invalid task data");
  }

  const {
    id,
    title,
    description,
    priority,
    dueDate,
    status
  } = validated.data;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        status: status.toUpperCase() as "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "REVIEWED",
        dueDate,
      },
      select: { projectId: true },
    });

    return task.projectId;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update task");
  }
}

