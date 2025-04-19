import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TaskProvider } from "@/context/TaskContext";

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <TaskProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </TaskProvider>
    </SidebarProvider>
  );
}
