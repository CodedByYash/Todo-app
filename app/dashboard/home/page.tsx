import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default async function DashboardHomePage() {
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

  // Get user's workspaces
  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: dbUser.id,
        },
      },
    },
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get user's recent tasks
  const recentTasks = await db.task.findMany({
    where: {
      userId: dbUser.id,
    },
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get upcoming tasks
  const upcomingTasks = await db.task.findMany({
    where: {
      userId: dbUser.id,
      completed: false,
      dueDate: {
        gte: new Date(),
      },
    },
    take: 5,
    orderBy: {
      dueDate: "asc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardOverview
        user={dbUser}
        workspaces={workspaces}
        recentTasks={recentTasks}
        upcomingTasks={upcomingTasks}
      />
    </div>
  );
}
