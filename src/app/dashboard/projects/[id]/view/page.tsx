import { prisma } from "@/lib/prisma";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Task from "@/components/Task";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "@/components/nav-user";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch project details using the dynamic `id` from `params`

  const project = await prisma.project.findUnique({
    where: { id: id },
  });

  const sessionResponse = await authClient.getSession();
  const user = await sessionResponse?.data?.user ?? null;

  // Render project details and include AddTask component
  return (
    <div>
      <header className="flex h-9 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Project</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{project?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
      
            <NavUser/>
        
        </div>
      </header>
      <div className="flex flex-1 flex-col px-6 pt-0">
        <Suspense fallback={<h1>Loading...</h1>}>
          <Task projectId={id} projectName={project?.name || ""} />
        </Suspense>
      </div>
    </div>
  );
}
