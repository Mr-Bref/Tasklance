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
  projectId: string,
}

import { Status } from "@prisma/client";
import { pusherServer } from "@/lib/pusher-server";

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

  await pusherServer.trigger('private-project-' + projectId, 'new-task-event', {
    message: 'Yo user!',
  });

}





export async function updateTaskStatus(taskId: string, status: string) {
  const prismaStatus = statusMap[status.toLowerCase()]; // handle casing safely

  if (!prismaStatus) throw new Error("Invalid status");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: prismaStatus },
    select: { projectId: true },
  });

  // await pusherServer.trigger('private-project-' +  updatedTask.projectId, 'task-update-event', {
  //   message: 'Yo user!',
  // });
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
  assignees: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
      )
      .optional(),
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
    status,
    assignees
  } = validated.data;


  try {
    const participants = await prisma.participant.findMany({
      where: {
        userId: {
          in: assignees?.map(assignee => assignee.id), 
        },
      },
      select: {
        id: true, // Select the userId (or any necessary fields)
      },
    });

    console.log(participants)

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        status: status.toUpperCase() as "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "REVIEWED",
        dueDate  
      },
      select: { projectId: true },
    });

    await prisma.taskAssignement.createMany({
      data: participants.map((participant) => ({
        taskId: id, // id de la tâche que tu es en train de modifier
        participantId: participant.id, // le participant assigné à la tâche
      })),
    });

    return task.projectId;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update task");
  }
}

