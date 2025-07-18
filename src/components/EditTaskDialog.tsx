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
  X,
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
  stateId: z.string(),
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

export function EditTaskDialog() {
  const [activeTab, setActiveTab] = useState("details");

  const {
    taskBeingEdited,
    isEditDialogOpen,
    setIsEditDialogOpen,
    fetchTasks,
    participants,
    taskStates,
  } = useTaskContext();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      stateId: "",
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
        stateId: taskBeingEdited.stateId,
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
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header avec gradient */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Task
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/50"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation tabs stylée */}
          <TabsList className="grid grid-cols-3 w-full h-12 bg-gray-50 rounded-none border-b">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none h-full"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none h-full"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="assignees"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none h-full"
            >
              <User className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Contenu scrollable */}
              <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                <TabsContent value="details" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Task title"
                            className="h-9 border-gray-200 focus:border-green-500 focus:ring-green-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Task description"
                            className="resize-none h-20 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Priority
                        </FormLabel>
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
                                  "justify-start h-10 px-3 text-xs transition-all",
                                  field.value === value
                                    ? "bg-green-600 hover:bg-green-700 border-green-600"
                                    : "hover:bg-gray-50 border-gray-200"
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

                  <FormField
                    control={form.control}
                    name="stateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 border-gray-200 focus:border-green-500 focus:ring-green-500">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taskStates.map((state) => (
                              <SelectItem key={state.id} value={state.id}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: state.color || "#6B7280" }}
                                  />
                                  {state.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="schedule" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Due Date
                        </FormLabel>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="rounded-md border-0"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="assignees" className="mt-0 space-y-4">
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
                          {/* Assigned members */}
                          {assignedMembers.length > 0 && (
                            <div className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Assigned ({assignedMembers.length})
                              </FormLabel>
                              <div className="space-y-2">
                                {assignedMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={member.avatar}
                                        alt={member.name}
                                      />
                                      <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                        {member.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 text-sm font-medium">
                                      {member.name}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
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
                            </div>
                          )}

                          {/* Available members */}
                          {unassignedMembers.length > 0 && (
                            <div className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Available Team Members
                              </FormLabel>
                              <div className="space-y-2">
                                {unassignedMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={member.avatar}
                                        alt={member.name}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {member.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 text-sm">
                                      {member.name}
                                    </span>
                                    <Button
                                      size="sm"
                                      className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
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
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>
              </div>

              {/* Footer avec actions */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  {["details", "schedule", "assignees"].map((tab, index) => (
                    <div
                      key={tab}
                      className={cn(
                        "h-2 rounded-full transition-all cursor-pointer",
                        activeTab === tab
                          ? "w-8 bg-green-600"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      )}
                      onClick={() => setActiveTab(tab)}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 text-sm border-gray-200 hover:bg-gray-50"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-4 text-sm bg-green-600 hover:bg-green-700"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
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
