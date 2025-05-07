"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Plus, X, Send, User, Users, Shield } from "lucide-react";
import { inviteToProject } from "@/actions/invitation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().optional(),
  message: z.string().optional(),
  permission: z.enum(["VIEWER", "MEMBER", "MANAGER"]),
});

type InviteFormValues = z.infer<typeof schema>;

type Invitation = {
  email: string;
  permission: "VIEWER" | "MEMBER" | "MANAGER";
};

const roles = [
  { label: "View only", value: "VIEWER", description: "Can view tasks" },
  { label: "Edit", value: "MEMBER", description: "Can view & edit tasks" },
  { label: "Manage", value: "MANAGER", description: "Full project access" },
];

export function InviteDialog({
  open,
  onOpenChange,
  currentProjectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProjectId: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      permission: "VIEWER",
      message: "",
    },
  });

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [emailError, setEmailError] = useState("");
  const [isPending, startTransition] = useTransition();

  const addInvitation = () => {
    const email = getValues("email");
    const permission = getValues("permission");

    if (!email) {
      setEmailError("Please enter an email address");
      return;
    }

    const alreadyExists = invitations.some((inv) => inv.email === email);
    if (alreadyExists) {
      setEmailError("This email is already added");
      return;
    }

    const result = schema.safeParse({ email, permission });

    if (!result.success) {
      setEmailError("Invalid email format");
      return;
    }

    setInvitations([...invitations, { email, permission }]);
    setValue("email", "");
    setEmailError("");
  };

  const removeInvitation = (email: string) => {
    setInvitations(invitations.filter((inv) => inv.email !== email));
  };

  const onSubmit = (data: InviteFormValues) => {
    if (invitations.length === 0) return;

    startTransition(async () => {
      try {
        await Promise.all(
          invitations.map((inv) =>
            inviteToProject({
              email: inv.email,
              role: inv.permission,
              message: data.message,
              projectId: currentProjectId,
            })
          )
        );

        setInvitations([]);
        reset();
        toast.success('Invitation envoye avec succes')
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to send invitations", err);
      }
    });
  };

  const getPermissionBadge = (permission: string) => {
    const base = "flex items-center gap-1 text-xs";
    switch (permission) {
      case "VIEWER":
        return cn(base, "bg-blue-50 text-blue-700");
      case "MEMBER":
        return cn(base, "bg-purple-50 text-purple-700");
      case "MANAGER":
        return cn(base, "bg-amber-50 text-amber-700");
      default:
        return base;
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "VIEWER":
        return <User className="h-3 w-3" />;
      case "MEMBER":
        return <Users className="h-3 w-3" />;
      case "MANAGER":
        return <Shield className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Invite people to collaborate
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Add team members and set their roles before sending.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                {...register("email")}
                className={cn(
                  "pl-10",
                  emailError && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              <Button
                type="button"
                size="sm"
                variant="default"
                className="absolute right-1 cursor-pointer top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={addInvitation}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>

          {/* Permission selection */}
          <div className="space-y-2">
            <Label>Permission level</Label>
            <RadioGroup
              defaultValue="VIEWER"
              onValueChange={(val: "VIEWER" | "MEMBER" | "MANAGER") =>
                setValue("permission", val)
              }
              className="grid grid-cols-3 gap-2"
            >
              {roles.map((role) => (
                <div key={role.value}>
                  <RadioGroupItem
                    value={role.value}
                    id={role.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={role.value}
                    className="flex flex-col items-start justify-center space-y-1 rounded-md border p-3 text-left cursor-pointer peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-muted peer-data-[state=checked]:shadow-sm"
                  >
                    <span className="font-medium">{role.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {role.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Let's collaborate on this project..."
              {...register("message")}
              rows={3}
            />
          </div>

          {/* Pending invitations */}
          {invitations.length > 0 && (
            <div className="space-y-2">
              <Label>Pending invitations</Label>
              <div className="rounded-md border bg-muted/40 p-3 space-y-2">
                {invitations.map((inv) => (
                  <div
                    key={inv.email}
                    className="flex items-center justify-between bg-background p-2 rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{inv.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPermissionBadge(inv.permission)}
                      >
                        {getPermissionIcon(inv.permission)}
                        {inv.permission.toLowerCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => removeInvitation(inv.email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="flex-col sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || invitations.length === 0}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isPending
                ? "Sending..."
                : `Send ${invitations.length} invitation${invitations.length > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
