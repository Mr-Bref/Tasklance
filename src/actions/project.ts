"use server";

import {prisma} from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createProject(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;

  if (!name.trim()) throw new Error("Project name is required");

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  const state = await prisma.state.create({
    data: {
      label: "To Do",
      projectId: project.id,
    },
  });

  
  return project;
}

export async function DeleteProject(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;

  if (!name.trim()) throw new Error("Project name is required");

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  return project;
}
