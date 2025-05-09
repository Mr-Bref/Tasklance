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
import { UserPreview, useTaskContext, Task } from "@/context/TaskContext";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
export type TaskPriority = "low" | "medium" | "high";


export interface TaskCardProps extends Task {
  className?: string;
  state : string;
  onStatusChange?: (id: string, stateId: string) => void;
}

export function TaskCard({
  id,
  title,
  description,
  stateId,
  state,
  priority,
  dueDate,
  assignees,
  className,
  onStatusChange,
}: TaskCardProps) {
  const { fetchTasks, setIsEditDialogOpen, setTaskBeingEdited } =
    useTaskContext();

  const { listeners, setNodeRef, attributes, transform, isDragging } =
    useDraggable({ id });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const handleStatusChange = async (newStatus: string) => {
    const projectId = await updateTaskStatus(id, newStatus); // raw string
    fetchTasks(projectId);
  };

  const handleDeleteTask = async () => {
    const projectId = await deleteTask(id);
    fetchTasks(projectId);
  };

  const isOverdue =
    dueDate && dueDate < new Date() && state !== "completed";


  const priorityConfig = {
    LOW: { icon: <Flag className="h-4 w-4 text-green-500" />, label: "Low" },
    MEDIUM: {
      icon: <Flag className="h-4 w-4 text-amber-500" />,
      label: "Medium",
    },
    HIGHT: { icon: <Flag className="h-4 w-4 text-rose-500" />, label: "High" },
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
          "cursor-grab active:cursor-grabbing p-3 mx-auto",
          "w-full min-w-[300px] max-w-md transition-all hover:shadow-md",
          className
        )}
      >
        <CardHeader className="py-0 px-3 flex flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant={"outline"}
              className="whitespace-nowrap text-xs px-1.5 py-0"
            >
              {}
            </Badge>
            <h3 className="font-medium text-sm leading-tight truncate">
              {title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                  //  onClick={() => handleStatusChange(key as TaskStatus)}
                  >
                    Mark task as 
                  </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setTaskBeingEdited({
                    id,
                    title,
                    description,
                    status: state,
                    priority,
                    dueDate,
                    assignees,
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

        {description && (
          <CardContent className="py-0 px-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          </CardContent>
        )}

        <CardFooter className="py-0 px-3 flex flex-col gap-1.5">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5 text-xs">
              {priorityConfig[priority]?.icon || (
                <span className="h-2 w-2 rounded-full bg-slate-400" />
              )}
              <span className="text-muted-foreground">
                {priorityConfig[priority]?.label || "Normal"}
              </span>
            </div>

            {dueDate && (
              <div className="flex items-center gap-1.5 text-xs">
                {isOverdue ? (
                  <AlertCircle className="h-3 w-3 text-destructive" />
                ) : (
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-muted-foreground",
                    isOverdue && "text-destructive font-medium"
                  )}
                >
                  {format(dueDate, "MMM d")}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center w-full">
          {assignees && assignees.length > 0 ? (
  <div className="flex items-center gap-1.5">
    <Avatar className="h-5 w-5">
      <AvatarImage
        src={assignees[0]?.avatar || "/placeholder.svg"} // Use the first assignee
        alt={assignees[0]?.name}
      />
      <AvatarFallback className="text-[10px]">
        {assignees[0]?.name.charAt(0)} {/* Display first character of the first assignee's name */}
      </AvatarFallback>
    </Avatar>
    <span className="text-xs text-muted-foreground truncate max-w-[100px]">
      {assignees[0]?.name} {/* Display the name of the first assignee */}
    </span>
  </div>
) : (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <User className="h-3 w-3" />
    <span>Unassigned</span>
  </div>
)}


            {state !== "completed" ? (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
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
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default React.memo(TaskCard);
