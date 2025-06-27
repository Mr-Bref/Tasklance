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
    }
    
    fetchData();
  }, []);

  if (!user) return null; // Si l'utilisateur n'est pas connecté, on ne rend rien

  return (
    <Sidebar collapsible="icon" {...props} className="bg-violet-400">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex px-2 items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                className="px-2 hover:cursor-pointer hover:text-dark rounded-none bg-green-400 hover:bg-green-300 font-semibold"
                  tooltip="New Project"
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
        <NavProjects projects={projects} fetchProject={fetchProjects} />
      </SidebarContent>
      <SidebarFooter>
      
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
