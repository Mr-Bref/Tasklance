// components/Column.tsx
import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { NewTaskDialog } from "./NewTaskDialog";
import { Task, useTaskContext } from "@/context/TaskContext";
import { TaskCard } from "./TaskCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ColorPicker } from "./ColorPicker";
import { duplicateList, updateListColor } from "@/actions/list";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ColumnProps = {
  title: string;
  color: string; // exemple: "muted", "primary", "secondary"
  tasks: Task[];
  emptyMessage: string;
  id: string;
  projectId: string;
};

export function Column({
  title,
  color,
  tasks,
  emptyMessage,
  id,
  projectId,
}: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: id });

  const [formOpen, setFormOpen] = useState(false);
  const { fetchTasks, setIsStateDialogOpen, setAction, setStateBeingEdited } =
    useTaskContext();

  const onselect = (color: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("color", color);
    updateListColor(formData)
      .then(() => {
        fetchTasks(projectId);
        console.log("Color updated");
      })
      .catch((error) => {
        console.error("Error updating color:", error);
      });
  };

  const handleDuplicateList = () => {
    const formData = new FormData();
    formData.append("id", id);
    duplicateList(formData)
      .then(() => {
        fetchTasks(projectId);
        console.log("List duplicated");
      })
      .catch((error) => {
        console.error("Error duplicating list:", error);
        toast.error("Error duplicating list");
      });
  };

  const handleCopyList = () => {
    setAction("copyState");
    setStateBeingEdited({
      color,
      tasks,
      id,
      label: title,
    });
    setIsStateDialogOpen(true);
  };

  const handleMoveList = () => {
    setAction("moveState");
    setStateBeingEdited({
      color,
      tasks,
      id,
      label: title,
    });
    setIsStateDialogOpen(true);
  };

  return (
    <div className="min-w-[260px] w-[260px] space-y-2 overflow-x-hidden">
      <h2 className="text-md font-semibold flex items-center gap-2 justify-between">
        <span>
          <span
            className={`inline-block w-3 h-3 rounded-full bg-${color}`}
          ></span>
          {title} ({tasks.length})
        </span>

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
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log(`Edit column ${id}`)}>
              Edit List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicateList}>
              Duplicate List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMoveList}>
              Move List to
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyList}>
              Copy List to
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log(`Archive column ${id}`)}
            >
              Archive List
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <ColorPicker
              onSelect={onselect}
              selected={color} // Pass the current color to the ColorPicker
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </h2>
      <div
        ref={setNodeRef}
        className={cn(
          "space-y-2 border-gray-200 rounded-md overflow-y-auto overflow-x-hidden max-h-[calc(100vh-200px)] hide-scrollbar border-2 p-2 flex flex-col items-center transition-all duration-300 scroll-p-2",
          `bg-${color}`, // Dynamic background color based on the `color` variable
          isOver && "border-blue-500 bg-blue-100", // Conditional classes when `isOver` is true
          !isOver && "border-gray-200" // Conditional class for when `isOver` is false
        )}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} state={title} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm  px-4 py-4 mx-auto gap-2 text-muted-foreground p-4 text-center border border-dashed rounded-lg">
            {emptyMessage}
          </p>
        )}
      </div>
      <NewTaskDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        projectId={projectId}
        columnId={id}
      />
    </div>
  );
}

export default React.memo(Column);
