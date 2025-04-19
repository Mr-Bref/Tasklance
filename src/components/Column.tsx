// components/Column.tsx
import { useDroppable } from "@dnd-kit/core";
import TaskCard, {  TaskProps, TaskStatus } from "./TaskCard";
import React from "react";

type ColumnProps = {
  title: string;
  color: string; // exemple: "muted", "primary", "secondary"
  tasks: TaskProps[];
  emptyMessage: string;
  id: TaskStatus;
};

export function Column({ title, color, tasks, emptyMessage, id }: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: id });


  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 scrollbar-thin">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span
          className={`inline-block w-3 h-3 rounded-full bg-${color}`}
        ></span>
        {title} ({tasks.length})
      </h2>
      <div
        ref={setNodeRef}
        className={`space-y-3 border-gray-200 rounded-md overflow-x-hidden border-2 p-6 transition-all duration-300 ${
          isOver ? "border-blue-500 bg-blue-100" : "border-gray-200"
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default React.memo(Column);

