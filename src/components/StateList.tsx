"use client";

import { TaskState } from "@/context/TaskContext";
import { cn } from "@/lib/utils"; // Utilitaire pour les classes conditionnelles si tu veux (facultatif)

export function StateList({
  states,
  onSelect,
  selectedId,
}: {
  states: TaskState[];
  onSelect: (state: TaskState) => void;
  selectedId?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {states.map((state) => (
        <button
          key={state.id}
          onClick={() => onSelect(state)}
          className={cn(
            "p-3 rounded-md border text-left hover:bg-muted transition",
            state.id === selectedId && "border-primary bg-muted"
          )}
        >
          {state.label}
        </button>
      ))}
    </div>
  );
}
