"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StateList } from "./StateList";
import { TaskState, useTaskContext } from "@/context/TaskContext"; // adapte selon ton contexte
import { copyToState, moveToState } from "@/actions/list";

export function StateDialog() {
  const {
    isStateDialogOpen,
    setIsStateDialogOpen,
    stateBeingEdited,
    taskStates,
    action,
    fetchTasks,
  } = useTaskContext();

  const handleSelect = async (nextState: TaskState) => {
    if (nextState.id === stateBeingEdited?.id) return;

    const formData = new FormData();
    formData.append("fromStateId", stateBeingEdited?.id as string);
    formData.append("toStateId", nextState.id);

    if (action == "copyState") {
      copyToState(formData)
        .then((res) => {
          if (res?.projectId) {
            fetchTasks(res.projectId);
          }
          console.log("Color updated");
          setIsStateDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error updating color:", error);
        });
    } else {
      moveToState(formData)
        .then((res) => {
          if (res?.projectId) {
            fetchTasks(res.projectId);
          }
          console.log("Color updated");
          setIsStateDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error updating color:", error);
        });
    }
  };

  return (
    <Dialog open={isStateDialogOpen} onOpenChange={setIsStateDialogOpen}>
      <DialogContent className="top-10 translate-y-0">
        <DialogHeader>
          <DialogTitle>Choose a List</DialogTitle>
        </DialogHeader>

        <StateList
          states={taskStates}
          onSelect={handleSelect}
          selectedId={stateBeingEdited?.id}
        />
      </DialogContent>
    </Dialog>
  );
}
