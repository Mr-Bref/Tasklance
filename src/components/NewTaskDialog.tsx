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
          <Button variant="default" className="text-black hover:cursor-pointer rounded-none bg-green-400"><PlusIcon /> New Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] top-10 sm:top-10 translate-y-0">
          <DialogHeader>
            <DialogTitle >Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the task details below.
            </DialogDescription>
          </DialogHeader>
          <NewTaskForm  projectId={projectId} onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    )
  }
  