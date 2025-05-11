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
