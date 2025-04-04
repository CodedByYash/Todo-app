"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserPlus, MoreHorizontal, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Invitation form schema
const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]),
});

// Role update schema
const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]),
});

type User = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  jobTitle: string | null;
};

type Member = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  user: User;
};

type Workspace = {
  id: string;
  name: string;
  type: "PERSONAL" | "PROFESSIONAL";
  members: Member[];
};

type WorkspaceMembersProps = {
  workspace: Workspace;
  isAdmin: boolean;
  currentUserId: string;
};

export function WorkspaceMembers({
  workspace,
  isAdmin,
  currentUserId,
}: WorkspaceMembersProps) {
  const router = useRouter();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  // Invite form
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  // Handle invitation submission
  async function onSubmit(values: z.infer<typeof inviteSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to invite member");
      }

      // Close dialog and reset form
      setInviteDialogOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error inviting member:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update member role
  async function updateMemberRole(
    memberId: string,
    role: "ADMIN" | "MEMBER" | "GUEST"
  ) {
    try {
      const response = await fetch(
        `/api/workspaces/${workspace.id}/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update member role");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating member role:", error);
      // TODO: Show error toast
    }
  }

  // Remove member
  async function removeMember() {
    if (!memberToRemove) return;

    try {
      const response = await fetch(
        `/api/workspaces/${workspace.id}/members/${memberToRemove.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove member");
      }

      setRemoveDialogOpen(false);
      setMemberToRemove(null);
      router.refresh();
    } catch (error) {
      console.error("Error removing member:", error);
      // TODO: Show error toast
    }
  }

  // Get badge variant based on role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "OWNER":
        return "default";
      case "ADMIN":
        return "secondary";
      case "MEMBER":
        return "outline";
      case "GUEST":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {workspace.type === "PERSONAL"
                ? "Personal workspaces don't support multiple members."
                : "Manage members of your workspace."}
            </CardDescription>
          </div>
          {isAdmin && workspace.type === "PROFESSIONAL" && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspace.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.user.imageUrl || undefined} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0) ||
                        member.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.user.name || member.user.email}
                      {member.user.id === currentUserId && " (You)"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.user.email}
                    </div>
                    {member.user.jobTitle && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {member.user.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>

                  {isAdmin &&
                    member.user.id !== currentUserId &&
                    member.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateMemberRole(member.id, "ADMIN")}
                            className={
                              member.role === "ADMIN" ? "bg-muted" : ""
                            }
                          >
                            Make Admin
                            {member.role === "ADMIN" && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateMemberRole(member.id, "MEMBER")
                            }
                            className={
                              member.role === "MEMBER" ? "bg-muted" : ""
                            }
                          >
                            Make Member
                            {member.role === "MEMBER" && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateMemberRole(member.id, "GUEST")}
                            className={
                              member.role === "GUEST" ? "bg-muted" : ""
                            }
                          >
                            Make Guest
                            {member.role === "GUEST" && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setMemberToRemove(member);
                              setRemoveDialogOpen(true);
                            }}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite member dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite a new member to your workspace. They will receive an email
              invitation.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="GUEST">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Admins can manage workspace settings and members. Members
                      can create and edit tasks. Guests can only view tasks.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Inviting..." : "Invite"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Remove member confirmation dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              {memberToRemove?.user.name || memberToRemove?.user.email} from
              this workspace?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={removeMember}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
