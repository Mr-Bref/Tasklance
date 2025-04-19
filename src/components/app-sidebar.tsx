"use client";

import * as React from "react";
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  PlusCircleIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { useEffect, useState } from "react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createProject } from "@/actions/project";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ProStack Inc",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = async (formData: FormData) => {
    startTransition(async () => {
      await createProject(formData); // Calls server action
      await fetchProjects(); // Fetch updated projects
      setProjectName(""); // Reset input
      setOpen(false); // Close modal after success
    });
  };

  async function fetchProjects() {
    const res = await fetch("/api/project");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    async function fetchData() {
      const sessionResponse = await authClient.getSession();
      const user = sessionResponse?.data?.user ?? null;
      setUser(user);

      if (user) {
        await fetchProjects();
      }
    }

    fetchData();
  }, []);

  if (!user) return null; // Si l'utilisateur n'est pas connecté, on ne rend rien

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex px-2 items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="New Project"
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear"
                >
                  <PlusCircleIcon />
                  New Project
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Project</DialogTitle>
                  <DialogDescription>
                    Enter the name of your new project
                  </DialogDescription>
                </DialogHeader>
                <form action={handleCreateProject}>
                  <div className="py-4">
                    <Input
                      type="text"
                      placeholder="Project Name"
                      name="name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={!projectName.trim() || isPending}
                    >
                      {isPending ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.image as string,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
