"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  stateId: string;
};

import { pusherServer } from "@/lib/pusher-server";

export async function createTask(data: CreateTaskInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const { title, description, dueDate, projectId, priority, stateId } = data;

  if (!title?.trim()) throw new Error("Title is required");
  if (!dueDate) throw new Error("Due date is required");

  await prisma.task.create({
    data: {
      title,
      description: description || "",
      dueDate,
      priority,
      stateId: stateId,
    },
  });

  // await pusherServer.trigger("private-project-" + projectId, "new-task-event", {
  //   message: "Yo user!",
  // });
}

export async function updateTaskStatus(taskId: string, stateId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { stateId: stateId },
    select: {
      state: {
        select: {
          project: true,
        },
      },
    },
  });

  const projectId = updatedTask.state.project.id;

  void pusherServer.trigger(
    "private-project-" + projectId,
    "task-update-event",
    {
      message: "Yo user!",
    }
  );
  return projectId;
}

export async function deleteTask(id: string): Promise<string> {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) throw new Error("Task not found");

  const deletedTask = await prisma.task.delete({
    where: { id },
    select: {
      id: true,
      state: {
        select: {
          projectId: true,
        },
      },
    },
  });

  return deletedTask.state.projectId;
}

const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  stateId: z.string(),
  dueDate: z.date(),
  assignees: z
    .array(
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

  const { id, title, description, priority, dueDate, assignees , stateId} =
    validated.data;

  try {
    const participants = await prisma.participant.findMany({
      where: {
        userId: {
          in: assignees?.map((assignee) => assignee.id),
        },
      },
      select: {
        id: true, // Select the userId (or any necessary fields)
      },
    });

    console.log(participants);

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        stateId : stateId,
        dueDate,
      },
     select: {
        state: {
          select: {
            projectId: true,
          },
        },
      },
    });

    // await prisma.taskAssignement.createMany({
    //   data: participants.map((participant) => ({
    //     taskId: id, // id de la tâche que tu es en train de modifier
    //     participantId: participant.id, // le participant assigné à la tâche
    //   })),
    // });

    return task.state.projectId;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update task");
  }
}
