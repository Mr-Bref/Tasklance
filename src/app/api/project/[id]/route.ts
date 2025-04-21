import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Fetch the session to check for authorization
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Extract the project ID from params
  const { id } = params;

  // Check if the session exists, if not return an unauthorized error
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id; // ou peu importe comment tu récupères l'id

  // Fetch the project from the database, including tasks and task assignments
  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: userId },
        {
          participants: {
            some: {
              userId: userId,
            },
          },
          NOT: {
            ownerId: userId,
          },
        },
      ],
    },
    include: {
      tasks: {
        include: {
          taskAssignement: {
            include: {
              participant: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
      participants: { include: { user: true } },
    },
  });

  // If no project is found, return an error message
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Map over the tasks and structure them as needed
  const mappedTasks = project.tasks.map((task) => {
    const assignees = task.taskAssignement
      ?.map((assignement) => {
        const user = assignement.participant?.user;
        if (!user) return null;
        return {
          id: user.id,
          name: user.name || "Unnamed",
          avatar: user.image || "/placeholder.svg?height=32&width=32",
        };
      })
      .filter(Boolean); // pour enlever les nulls

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: new Date(task.dueDate),
      ...(assignees?.length && { assignees }), // s'il y a au moins un assignee
    };
  });

  // Return the mapped tasks as JSON response
  return NextResponse.json( {
    tasks: mappedTasks,
    participants: project.participants?.map((p) => ({
      id: p.user.id,
      name: p.user.name || "Unnamed",
      avatar: p.user.image || "/placeholder.svg?height=32&width=32",
    })) ?? [],
  });
}
