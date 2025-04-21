"use client";

//import { createTask } from "@/actions/task";
import { useEffect, useState } from "react";
import { TaskCard, TaskStatus } from "./TaskCard";
import { NewTaskDialog } from "./NewTaskDialog";
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
export default function Task({ projectId }: { projectId: string }) {
  const { tasks, fetchTasks, updateTaskLocally } = useTaskContext();
  const [formOpen, setFormOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const completedTasks = tasks.filter((task) => task.status === "completed");
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
      channel = pusher.subscribe('private-project-' + projectId);
      
      channel.bind('new-task-event', () => {
        console.log(`New task data`);
        fetchTasks(projectId)
        toast.success('New task created')
      });

      channel.bind('task-update-event', (data: string) => {
        console.log(`task updated`);
        fetchTasks(projectId)
        console.log(data)
      });

      channel.bind('pusher:subscription_succeeded', () => {
        console.log('👥 Utilisateurs en ligne :', channel.subscribed);
      });
    
      channel.bind('pusher:member_added', (member: unknown) => {
        console.log('✅ User connecté :', member);
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
    const newStatus = over.id as TaskStatus;

    updateTaskStatus(taskId, newStatus).then(() => {
      updateTaskLocally(taskId, newStatus);
    });
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Project Tasks</h1>
            <NewTaskDialog
              open={formOpen}
              onOpenChange={setFormOpen}
              projectId={projectId}
            />
            
            {/* Edit task Dialog */}
            <EditTaskDialog />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">

            <Column
              id="todo"
              title="To Do"
              color="muted"
              tasks={todoTasks}
              emptyMessage="No tasks to do"
            />
            <Column
              id="inprogress"
              title="In Progress"
              color="secondary"
              tasks={inProgressTasks}
              emptyMessage="No tasks in progress"
            />
            <Column
              id="completed"
              title="Completed"
              color="primary"
              tasks={completedTasks}
              emptyMessage="No completed tasks"
            />
          </div>
          <DragOverlay>
            {activeTaskId
              ? (() => {
                  const task = tasks.find((t) => t.id === activeTaskId);
                  if (!task) return null;

                  return (
                    <TaskCard
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      assignees={task.assignees}
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
