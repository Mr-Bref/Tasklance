"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Loader2,
  CalendarIcon,
  Users,
  User,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { updateTask } from "@/actions/task";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/context/TaskContext";

// 👇 Simplified schema: use raw strings as enums
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date({ required_error: "A due date is required" }),
  status: z.enum(["todo", "inprogress", "completed", "canceled", "reviewed"]),
  assignees: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string(),
      })
    )
    .optional(),
});

type TaskFormValues = z.infer<typeof TaskSchema>;

const priorityConfig = {
  low: { label: "Low", color: "bg-slate-600" },
  medium: { label: "Medium", color: "bg-amber-500" },
  high: { label: "High", color: "bg-rose-500" },
};

const statusConfig = {
  todo: { label: "To Do", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  inprogress: { label: "In Progress", icon: <Clock className="h-3.5 w-3.5" /> },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  canceled: {
    label: "Canceled",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  reviewed: {
    label: "Reviewed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
};

export function EditTaskDialog() {
  const [activeTab, setActiveTab] = useState("details");

  const {
    taskBeingEdited,
    isEditDialogOpen,
    setIsEditDialogOpen,
    fetchTasks,
    participants,
  } = useTaskContext();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: undefined,
      assignees: [],
    },
  });

  useEffect(() => {
    if (taskBeingEdited) {
      form.reset({
        title: taskBeingEdited.title,
        description: taskBeingEdited.description ?? "",
        priority:
          taskBeingEdited.priority.toLowerCase() as TaskFormValues["priority"],
        status: taskBeingEdited.status,
        dueDate: taskBeingEdited.dueDate
          ? new Date(taskBeingEdited.dueDate)
          : undefined,
        assignees: taskBeingEdited.assignees ?? [],
      });
    }
  }, [taskBeingEdited, form]);

  const onSubmit = async (data: TaskFormValues) => {
    if (!taskBeingEdited) return;

    const projectId = await updateTask({ ...data, id: taskBeingEdited.id });

    await fetchTasks(projectId);

    toast.success("Task updated!");
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-md p-4 min-h-[500px] overflow-hidden flex justify-start flex-col">
        <DialogHeader className="px-4 pt-3">
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none border-b">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-background"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-background"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="assignees"
              className="data-[state=active]:bg-background"
            >
              <User className="h-4 w-4 mr-2" />
              Assignees
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
                <TabsContent value="details" className="mt-0 space-y-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Task description"
                            className="resize-none h-20"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(priorityConfig).map(
                            ([value, config]) => (
                              <Button
                                key={value}
                                type="button"
                                variant={
                                  field.value === value ? "default" : "outline"
                                }
                                className={cn(
                                  "justify-start h-14 px-3",
                                  field.value === value && "ring-2"
                                )}
                                onClick={() => field.onChange(value)}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${config.color} mr-2`}
                                />
                                {config.label}
                              </Button>
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="schedule" className="mt-0 space-y-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(statusConfig).map(
                              ([value, config]) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="flex items-center"
                                >
                                  <div className="flex items-center">
                                    {config.icon}
                                    <span className="ml-2">{config.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="assignees" className="mt-0">
                  <FormField
                    control={form.control}
                    name="assignees"
                    render={({ field }) => {
                      const assignedIds = field.value?.map((a) => a.id) ?? [];
                      const assignedMembers = participants.filter((m) =>
                        assignedIds.includes(m.id)
                      );
                      const unassignedMembers = participants.filter(
                        (m) => !assignedIds.includes(m.id)
                      );

                      return (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Assign To
                          </FormLabel>
                          <div>
                            <div className="space-y-2 mt-2">
                              <h4 className="text-sm font-semibold text-muted-foreground">
                                Assigned
                              </h4>
                              {assignedMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-3 p-2"
                                >
                                  <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                      src={member.avatar}
                                      alt={member.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                      CN
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1">{member.name}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const current = field.value ?? [];
                                      field.onChange(
                                        current.filter(
                                          (m) => m.id !== member.id
                                        )
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2 mt-4">
                              <h4 className="text-sm font-semibold text-muted-foreground">
                                Team
                              </h4>
                              {unassignedMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-3 p-2"
                                >
                                  <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                      src={member.avatar}
                                      alt={member.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                      CN
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1">{member.name}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const current = field.value ?? [];
                                      field.onChange([...current, member]);
                                    }}
                                  >
                                    Assign
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>
              </div>

              <div className="flex items-center justify-between p-4 border-t bg-muted/30 absolute bottom-0 left-0 w-full">
                <div className="flex items-center gap-1">
                  {["details", "schedule", "assignees"].map((tab, index) => (
                    <div
                      key={tab}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        activeTab === tab
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted-foreground/30",
                        index <
                          ["details", "schedule", "assignees"].indexOf(
                            activeTab
                          ) && "bg-primary/60 w-1.5"
                      )}
                      onClick={() => setActiveTab(tab)}
                    />
                  ))}
                </div>

                <div className="flex gap-2 relative bottom-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Save Task"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
