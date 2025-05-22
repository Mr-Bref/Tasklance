"use server";
import { prisma } from "@/lib/prisma";
export default async function createList(formData: FormData) {
  const name = formData.get("name") as string;
  const projectId = formData.get("projectId") as string;

  if (!name.trim()) throw new Error("List name is required");

  const list = await prisma.state.create({
    data: {
      label: name,
      projectId,
    },
  });
  if (!list) throw new Error("Error creating list");
  return list;
}

export async function deleteList(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("List id is required");

  const list = await prisma.state.delete({
    where: {
      id: id,
    },
  });

  return list;
}

export async function updateListColor(formData: FormData) {
  const id = formData.get("id") as string;
  const color = formData.get("color") as string;

  if (!id) throw new Error("List id is required");
  if (!color) throw new Error("List color is required");

  const list = await prisma.state.update({
    where: {
      id: id,
    },
    data: {
      color: color,
    },
  });

  return list;
}

export async function duplicateList(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("List id is required");

  const list = await prisma.state.findUnique({
    where: { id },
    include: { tasks: true },
  });
  if (!list) throw new Error("List not found");

  const newList = await prisma.state.create({
    data: {
      label: list.label,
      projectId: list.projectId,
      color: list.color,
    },
  });

  const newTasks = list.tasks.length
    ? await prisma.task.createMany({
        data: list.tasks.map((task) => ({
          title: task.title,
          description: task.description,
          stateId: newList.id,
          dueDate: task.dueDate,
          priority: task.priority,
          color: task.color,
        })),
      })
    : [];

  return { list: newList, tasks: newTasks };
}

export async function copyToState(formData: FormData) {
  const fromStateId = formData.get("fromStateId") as string;
  const toStateId = formData.get("toStateId") as string;

  if (!fromStateId || !toStateId)
    throw new Error("Both state IDs are required");

  const tasks = await prisma.task.findMany({
    where: { stateId: fromStateId },
  });

  if (!tasks.length) return { copied: 0 };

  const state = await prisma.state.findFirst({
    where: {
      id: toStateId,
    },
  });

  await prisma.task.createMany({
    data: tasks.map((task) => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      color: task.color,
      stateId: toStateId,
    })),
  });

  return { copied: tasks.length, projectId: state?.projectId };
}

export async function moveToState(formData: FormData) {
  const fromStateId = formData.get("fromStateId") as string;
  const toStateId = formData.get("toStateId") as string;

  if (!fromStateId || !toStateId)
    throw new Error("Both state IDs are required");

  const state = await prisma.state.findFirst({
    where: {
      id: toStateId,
    },
  });

  const updatedTasks = await prisma.task.updateMany({
    where: { stateId: fromStateId },
    data: { stateId: toStateId },
  });

  return { moved: updatedTasks.count, projectId: state?.projectId };
}
