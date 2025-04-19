import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
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

  // Fetch the project from the database, including tasks and task assignments
  const project = await prisma.project.findFirst({
    where: { id },
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
    },
  });

  // If no project is found, return an error message
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Map over the tasks and structure them as needed
  const mappedTasks = project.tasks.map((task) => {
    const firstAssignee = task.taskAssignement?.[0]?.participant?.user;

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: new Date(task.dueDate),
      ...(firstAssignee && {
        assignee: {
          id: firstAssignee.id,
          name: firstAssignee.name || "Unnamed",  // Fallback to "Unnamed" if no name
          avatar: firstAssignee.image || "/placeholder.svg?height=32&width=32",  // Default avatar
        },
      }),
    };
  });

  // Return the mapped tasks as JSON response
  return NextResponse.json(mappedTasks);
}
