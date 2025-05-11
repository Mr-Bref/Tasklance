"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { getTasksById } from "@/data/Project"; // Adjust the import based on your actual data fetching logic

export type UserPreview = {
  id: string;
  name: string;
  avatar: string;
};

export interface TaskData {
  states: TaskState[];
  participants: UserPreview[];
}

export interface TaskState {
  label: string;
  id: string;
  tasks: Task[];
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string ;
  priority: 'LOW' | 'MEDIUM' | 'HIGHT';
  dueDate: Date;
  assignees: UserPreview[];
  stateId: string;
}
// Define the context state and actions
interface TaskContextType {
  taskStates: TaskState[];
  fetchTasks: (projectId: string) => Promise<void>;
  updateTaskLocally: (id: string, newStatus: string) => Promise<void>;
  setTaskStates: React.Dispatch<React.SetStateAction<TaskState[]>>;
  taskBeingEdited: Task | null;
  setTaskBeingEdited: (task: Task | null) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  participants: UserPreview[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [participants, setParticipants] = useState<UserPreview[]>([]);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchTasks = async (projectId: string) => {
    const data = await getTasksById(projectId);
    console.log('data');
    console.log(data);
    setTaskStates(data.states);
    setParticipants(data.participants);
  };

  const updateTaskLocally = async (id: string, newStatus: string) => {
   
  };


  return (
    <TaskContext.Provider
      value={{
        taskStates,
        fetchTasks,
        setTaskStates,
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
