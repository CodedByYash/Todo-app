"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, Users, Settings, ArrowRight, PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type User = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
};

type Member = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  user: User;
};

type Workspace = {
  id: string;
  name: string;
  description: string | null;
  type: "PERSONAL" | "PROFESSIONAL";
  imageUrl: string | null;
  members: Member[];
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | "no_priority";
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type WorkspaceDashboardProps = {
  workspace: Workspace;
  recentTasks: Task[];
  currentUserId: string;
};

export function WorkspaceDashboard({
  workspace,
  recentTasks,
  currentUserId,
}: WorkspaceDashboardProps) {
  // Check if user is admin or owner
  const isAdmin = workspace.members.some(
    (member) =>
      member.user.id === currentUserId &&
      (member.role === "OWNER" || member.role === "ADMIN")
  );

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-muted-foreground mt-1">
              {workspace.description}
            </p>
          )}
          <div className="flex items-center mt-2">
            <Badge
              variant={workspace.type === "PERSONAL" ? "secondary" : "default"}
            >
              {workspace.type === "PERSONAL" ? "Personal" : "Professional"}
            </Badge>
            <span className="text-sm text-muted-foreground ml-4">
              {workspace.members.length}{" "}
              {workspace.members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/workspaces/${workspace.id}/tasks/new`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Workspace Content */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest tasks and updates in this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent activity in this workspace.
                  </p>
                ) : (
                  recentTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        />
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(task.updatedAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant={task.completed ? "secondary" : "outline"}
                        >
                          {task.completed ? "Completed" : "In Progress"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="ml-2"
                        >
                          <Link href={`/dashboard/tasks/${task.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/workspaces/${workspace.id}/tasks`}>
                  View All Tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Members Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People with access to this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {workspace.members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.imageUrl || undefined} />
                      <AvatarFallback>
                        {member.user.name?.charAt(0) ||
                          member.user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-1 text-center">
                      <p className="text-xs font-medium truncate w-16">
                        {member.user.name || member.user.email.split("@")[0]}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                ))}
                {workspace.members.length > 5 && (
                  <div className="flex flex-col items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        +{workspace.members.length - 5}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/workspaces/${workspace.id}/members`}>
                  Manage Members
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>All tasks in this workspace</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href={`/dashboard/workspaces/${workspace.id}/tasks`}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visit the tasks page to see all tasks in this workspace.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>
                    People with access to this workspace
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href={`/dashboard/workspaces/${workspace.id}/members`}>
                    Manage Members
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspace.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
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
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.role === "OWNER"
                          ? "default"
                          : member.role === "ADMIN"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
