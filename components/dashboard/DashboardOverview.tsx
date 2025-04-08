"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Briefcase, ArrowRight, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type User = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
};

type Workspace = {
  id: string;
  name: string;
  type: "PERSONAL" | "PROFESSIONAL";
  imageUrl: string | null;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | "no_priority";
  dueDate: Date | null;
};

type DashboardOverviewProps = {
  user: User;
  workspaces: Workspace[];
  recentTasks: Task[];
  upcomingTasks: Task[];
};

export function DashboardOverview({
  user,
  workspaces,
  recentTasks,
  upcomingTasks,
}: DashboardOverviewProps) {
  // Calculate task completion rate
  const completedTasks = recentTasks.filter((task) => task.completed).length;
  const completionRate =
    recentTasks.length > 0
      ? Math.round((completedTasks / recentTasks.length) * 100)
      : 0;

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
      {/* Welcome Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            Welcome back, {user.name || user.email}!
          </CardTitle>
          <CardDescription>
            Here's an overview of your tasks and workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl || undefined} />
              <AvatarFallback>
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.name || user.email}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Your recent task completion rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/tasks">
              View All Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Workspaces */}
      <Card>
        <CardHeader>
          <CardTitle>Your Workspaces</CardTitle>
          <CardDescription>Quick access to your workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspaces.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You don't have any workspaces yet. Create one to get started.
              </p>
            ) : (
              workspaces.map((workspace) => (
                <motion.div
                  key={workspace.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {workspace.imageUrl ? (
                        <img
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          className="h-10 w-10 rounded-md"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{workspace.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {workspace.type === "PERSONAL"
                          ? "Personal"
                          : "Professional"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/workspaces/${workspace.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/workspaces/new">Create New Workspace</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Tasks with upcoming deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You don't have any upcoming tasks.
              </p>
            ) : (
              upcomingTasks.map((task) => (
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
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/tasks/${task.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/tasks">
              View All Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
