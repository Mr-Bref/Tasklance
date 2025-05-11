"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Options de couleurs avec labels
const colorOptions = [
  { value: "indigo-200", label: "Indigo" },
  { value: "emerald-200", label: "Emerald" },
  { value: "rose-200", label: "Rose" },
  { value: "violet-200", label: "Violet" },
  { value: "cyan-200", label: "Cyan" },
  { value: "amber-200", label: "Amber" },
  { value: "fuchsia-200", label: "Fuchsia" },
  { value: "lime-200", label: "Lime" },
  { value: "white", label: "None" },
];

// Correspondance exacte pour que Tailwind les garde
const colorClasses: Record<string, string> = {
  "indigo-200": "bg-indigo-200",
  "emerald-200": "bg-emerald-200",
  "rose-200": "bg-rose-200",
  "violet-200": "bg-violet-200",
  "cyan-200": "bg-cyan-200",
  "amber-200": "bg-amber-200",
  "fuchsia-200": "bg-fuchsia-200",
  "lime-200": "bg-lime-200",
  "white": "None",
};

export function ColorPicker({
  selected: initialSelected = "indigo-200",
  onSelect = () => {},
}: {
  selected?: string;
  onSelect?: (value: string) => void;
}) {
  const [selected, setSelected] = useState(initialSelected);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 bg-green-50">
        {colorOptions.map(({ value, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleSelect(value)}
                className={cn(
                  "w-7 h-7 rounded-full transition-all cursor-pointer border border-muted",
                  colorClasses[value],
                  value == 'white' && 'border-2 border-gray-200',
                  selected === value && "ring-2 ring-ring"
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
