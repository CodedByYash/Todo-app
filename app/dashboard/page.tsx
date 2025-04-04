import { TaskList } from "@/components/tasks/TaskList";
import { DashboardTaskList } from "@/components/dashboard/DashboardTaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user from database
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  // Check if user has any workspaces
  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: dbUser.id,
        },
      },
    },
  });

  // If no workspaces, redirect to workspace creation
  if (workspaces.length === 0) {
    redirect("/dashboard/workspaces/new");
  }

  // Get tasks for this user
  const tasks = await db.tasks.findMany({
    where: {
      userId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    },
  });

  // Convert Date objects to strings for the TaskList component
  const formattedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
        <Button asChild>
          <a href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </a>
        </Button>
      </div>

      <DashboardTaskList initialTasks={formattedTasks} />
    </div>
  );
}
