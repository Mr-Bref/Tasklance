import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { NewTaskForm } from "./NewTaskForm"
import { PlusIcon } from "lucide-react"
  
  type NewTaskDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string,
  }
  export function NewTaskDialog({ open, onOpenChange, projectId }: NewTaskDialogProps) {
    return (
      <Dialog  open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default"><PlusIcon /> New Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the task details below.
            </DialogDescription>
          </DialogHeader>
          <NewTaskForm  projectId={projectId} onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    )
  }
  