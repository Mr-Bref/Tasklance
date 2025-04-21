"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { getTasksById } from "@/data/Project"; // Adjust the import based on your actual data fetching logic
import { TaskProps, TaskStatus } from "@/components/TaskCard"; // Assuming TaskProps is the correct type for tasks

export type UserPreview = {
  id: string;
  name: string;
  avatar: string;
};

// Define the context state and actions
interface TaskContextType {
  tasks: TaskProps[];
  fetchTasks: (projectId: string) => Promise<void>;
  updateTaskLocally: (id: string, newStatus: TaskStatus) => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  taskBeingEdited: TaskProps | null;
  setTaskBeingEdited: (task: TaskProps | null) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  participants: UserPreview[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [participants, setParticipants] = useState<UserPreview[]>([]);
  const [taskBeingEdited, setTaskBeingEdited] = useState<TaskProps | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchTasks = async (projectId: string) => {
    const data = await getTasksById(projectId);
    setTasks(data.tasks);
    setParticipants(data.participants);
  };

  const updateTaskLocally = async (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };


  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        setTasks,
        updateTaskLocally,
        taskBeingEdited,
        setTaskBeingEdited,
        isEditDialogOpen,
        setIsEditDialogOpen,
        participants,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
