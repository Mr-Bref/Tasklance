"use client";

//import { createTask } from "@/actions/task";
import { useEffect, useState } from "react";
import { TaskCard } from "./TaskCard";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  TouchSensor,
  useSensors,
  useSensor,
  type DragEndEvent,
  PointerSensor,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { updateTaskStatus } from "@/actions/task";
import Column from "./Column";
import { EditTaskDialog } from "./EditTaskDialog";
import { createPusherClient } from "@/lib/pusher-client";
import { Channel } from "pusher-js";
import NewListInput from "./NewListInput";
import createList from "@/actions/list";
import { StateDialog } from "./StateDialog";
import ViewToggler from "./ViewToggler";

export default function Task({ projectId,projectName }: { projectId: string, projectName:string }) {
  const { fetchTasks, updateTaskLocally, taskStates } = useTaskContext();

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor)
  );
  useEffect(() => {
    fetchTasks(projectId); // Fetch tasks when the component mounts
  }, [projectId]);

  useEffect(() => {
    let channel: Channel;

    const setupPusher = async () => {
      const pusher = await createPusherClient();
      channel = pusher.subscribe("private-project-" + projectId);

      channel.bind("new-task-event", () => {
        console.log(`New task data`);
        fetchTasks(projectId);
        toast.success("New task created");
      });

      channel.bind("task-update-event", (data: string) => {
        console.log(`task updated`);
        fetchTasks(projectId);
        console.log(data);
      });

      channel.bind("pusher:subscription_succeeded", () => {
        console.log("👥 Utilisateurs en ligne :", channel.subscribed);
      });

      channel.bind("pusher:member_added", (member: unknown) => {
        console.log("✅ User connecté :", member);
      });
    };

    setupPusher();

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [projectId]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveTaskId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTaskId(null); // reset

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    updateTaskStatus(taskId, newStatus).then((projectId) => {
      fetchTasks(projectId);
    });
  }

  return (
    <>
      <div className="container overflow-y-hidden px-4 ">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{ projectName}</h1>
            <ViewToggler projectId={projectId} />

            {/* Edit task Dialog */}
            <EditTaskDialog />
            <StateDialog />
          </div>

          <div className="flex space-x-2 overflow-x-scroll">
            {taskStates.map((state) => {
              return (
                <Column
                  key={state.id}
                  title={state.label}
                  tasks={state.tasks}
                  emptyMessage="No card in this list"
                  id={state.id}
                  projectId={projectId}
                  color={state.color ?? "gray-200"}
                />
              );
            })}
            <NewListInput
              onAdd={async (name: string) => {
                console.log("New list name:", name);
                const formData = new FormData();
                formData.append("name", name);
                formData.append("projectId", projectId);
                await createList(formData);
                await fetchTasks(projectId);
              }}
            />
          </div>

          <DragOverlay>
            {activeTaskId
              ? (() => {
                  const task = taskStates
                    .flatMap((state) => state.tasks)
                    .find((task) => task.id === activeTaskId);
                  const state = taskStates.find(
                    (state) => state.id === task?.stateId
                  );
                  if (!task) return null;
                  return (
                    <TaskCard
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      state={state?.label ?? "Unknown State"}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      assignees={task.assignees}
                      stateId={task.stateId}
                      className="opacity-80 scale-105 pointer-events-none"
                    />
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
