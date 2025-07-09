import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Fetch the session to check for authorization
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Extract the project ID from params
  const { id } = await context.params;

  // Check if the session exists, if not return an unauthorized error
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id; // ou peu importe comment tu récupères l'id

  // Fetch the project from the database, including tasks and task assignments
  const project = await prisma.project.findMany({
    where: {
      id: id,
      OR: [
        {
          ownerId: userId,
        },
        {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      states: {
        include: {
          tasks: {
            include: {
              taskAssignements: {
                include: {
                  participant: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
              state: true,
              _count: {
                select: {
                  attachments: true,
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  // If no project is found, return an error message
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Map over the tasks and structure them as needed
  const mappedTasks = project
    .flatMap((p) => p.states)
    .map((state) => ({
      label: state.label,
      id: state.id,
      color: state.color,
      tasks: state.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority.toLowerCase(),
        dueDate: new Date(task.dueDate),
        assignees: task.taskAssignements.map((ta) => ({
          id: ta.participant.user.id,
          name: ta.participant.user.name || "Unnamed",
          avatar:
            ta.participant.user.image || "/placeholder.svg?height=32&width=32",
        })),
        stateId: task.stateId,
        attachmentCount: task._count.attachments,
        commentCount: task._count.comments,
      })),
    }));

  console.log("mappedTasks", mappedTasks);

  // Return the mapped tasks as JSON response
  return NextResponse.json({
    states: mappedTasks,
    participants: project
      .flatMap((p) => p.participants)
      .map((p) => ({
        id: p.user.id,
        avatar: p.user.image || "/placeholder.svg?height=32&width=32",
        name: p.user.name || "Unnamed",
      })),
  });
}
