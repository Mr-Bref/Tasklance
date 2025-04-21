"use client";

import { Folder, MoreHorizontal, Trash2, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InviteDialog } from "./InviteDialog";

interface NavProjectsProps {
  projects: {
    name: string;
    id: string;
  }[];
  fetchProject: () => Promise<void>;
}

export function NavProjects({ projects, fetchProject }: NavProjectsProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentProjectId, setCurrenProjectId] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <InviteDialog
        open={open}
        onOpenChange={setOpen}
        currentProjectId={currentProjectId}
      />
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                className="cursor-pointer"
                href={`/dashboard/projects/${item.id}/view`}
              >
                {item.name}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/projects/${item.id}/view`)
                  }
                  className="cursor-pointer"
                >
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(true);
                    setCurrenProjectId(item.id);
                  }}
                >
                  <User2 className="text-muted-foreground" />
                  <span>Invite</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
