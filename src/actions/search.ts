"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  projectId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.string().optional(),
  stateId: z.string().optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
});

export type SearchFilters = z.infer<typeof SearchSchema>;

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date;
  state: {
    id: string;
    label: string;
    project: {
      id: string;
      name: string;
    };
  };
  taskAssignements: {
    participant: {
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    };
  }[];
}

export async function searchTasks(filters: SearchFilters): Promise<SearchResult[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const validated = SearchSchema.safeParse(filters);
  if (!validated.success) {
    throw new Error("Invalid search filters");
  }

  const { query, projectId, priority, assigneeId, stateId, dueDateFrom, dueDateTo } = validated.data;

  try {
    // Build where clause dynamically
    const whereClause: any = {
      // User must be a participant in the project to see tasks
      state: {
        project: {
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      // Text search in title and description
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    // Add optional filters
    if (projectId) {
      whereClause.state.projectId = projectId;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (stateId) {
      whereClause.stateId = stateId;
    }

    if (assigneeId) {
      whereClause.taskAssignements = {
        some: {
          participant: {
            userId: assigneeId,
          },
        },
      };
    }

    if (dueDateFrom || dueDateTo) {
      whereClause.dueDate = {};
      if (dueDateFrom) {
        whereClause.dueDate.gte = dueDateFrom;
      }
      if (dueDateTo) {
        whereClause.dueDate.lte = dueDateTo;
      }
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        state: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        taskAssignements: {
          include: {
            participant: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        {
          dueDate: "asc",
        },
        {
          title: "asc",
        },
      ],
      take: 50, // Limit results
    });

    return tasks;
  } catch (error) {
    console.error("Search failed:", error);
    throw new Error("Failed to search tasks");
  }
}

export async function getSearchOptions(projectId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  try {
    // Get projects user has access to
    const projects = await prisma.project.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get states for the specified project or all accessible projects
    const states = await prisma.state.findMany({
      where: {
        project: {
          ...(projectId ? { id: projectId } : {}),
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
        label: true,
        projectId: true,
      },
    });

    // Get team members for the specified project or all accessible projects
    const participants = await prisma.participant.findMany({
      where: {
        project: {
          ...(projectId ? { id: projectId } : {}),
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return {
      projects,
      states,
      participants: participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        image: p.user.image,
      })),
    };
  } catch (error) {
    console.error("Get search options failed:", error);
    throw new Error("Failed to get search options");
  }
}