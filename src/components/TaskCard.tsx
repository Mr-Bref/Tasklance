"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  MoreHorizontal,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { updateTaskStatus, deleteTask } from "@/actions/task";
import { useTaskContext } from "@/context/TaskContext";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export type TaskStatus =
  | "todo"
  | "inprogress"
  | "completed"
  | "canceled"
  | "reviewed";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  className,
  onStatusChange,
}: TaskProps) {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(status);
  const { fetchTasks, setIsEditDialogOpen, setTaskBeingEdited } =
    useTaskContext();

  const { listeners, setNodeRef, attributes, transform, isDragging } =
    useDraggable({ id });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setCurrentStatus(newStatus);
    if (onStatusChange) onStatusChange(id, newStatus);
    const projectId = await updateTaskStatus(id, newStatus); // raw string
    fetchTasks(projectId);
  };

  const handleDeleteTask = async () => {
    const projectId = await deleteTask(id);
    fetchTasks(projectId);
  };

  const isOverdue =
    dueDate && dueDate < new Date() && currentStatus !== "completed";

  const statusConfig = {
    todo: { label: "To Do", variant: "outline" as const },
    inprogress: { label: "In Progress", variant: "secondary" as const },
    completed: { label: "Completed", variant: "default" as const },
    canceled: { label: "Canceled", variant: "destructive" as const },
    reviewed: { label: "Reviewed", variant: "outline" as const },
  };

  const priorityConfig = {
    low: { icon: <Flag className="h-4 w-4 text-green-500" />, label: "Low" },
    medium: {
      icon: <Flag className="h-4 w-4 text-amber-500" />,
      label: "Medium",
    },
    high: { icon: <Flag className="h-4 w-4 text-rose-500" />, label: "High" },
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={isDragging ? "opacity-0" : ""}
    >
      <Card
        className={cn(
          "cursor-grab active:cursor-grabbing",
          "w-full min-w-[300px] max-w-md transition-all hover:shadow-md",
          className
        )}
      >
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="space-y-1">
            <Badge variant={statusConfig[currentStatus].variant}>
              {statusConfig[currentStatus].label}
            </Badge>
            <h3 className="font-semibold text-base leading-tight">{title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(statusConfig).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleStatusChange(key as TaskStatus)}
                >
                  Mark as {statusConfig[key as TaskStatus].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setTaskBeingEdited({
                    id,
                    title,
                    description,
                    status: currentStatus,
                    priority,
                    dueDate,
                    assignee,
                  });
                  setIsEditDialogOpen(true);
                }}
              >
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteTask}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              {priorityConfig[priority].icon}
              <span className="text-muted-foreground">
                {priorityConfig[priority].label} Priority
              </span>
            </div>
            {dueDate && (
              <div className="flex items-center gap-2 text-sm">
                {isOverdue ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-muted-foreground",
                    isOverdue && "text-destructive font-medium"
                  )}
                >
                  {isOverdue ? "Overdue: " : "Due: "}
                  {format(dueDate, "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex justify-between items-center">
          {assignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {assignee.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Unassigned</span>
            </div>
          )}

          {currentStatus !== "completed" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleStatusChange("completed")}
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Complete
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Completed</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default React.memo(TaskCard);
