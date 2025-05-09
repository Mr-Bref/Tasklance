import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id; // ou peu importe comment tu récupères l'id

  // 1. Projets que tu possèdes
  const ownedProjects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });

  // 2. Projets où tu es participant (mais pas owner)
  const invitedProjects = await prisma.project.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
      NOT: {
        ownerId: userId,
      },
    },
  });

  // 3. Tu merges tout
  const allProjects = [...ownedProjects, ...invitedProjects];

  return NextResponse.json(allProjects);
}
