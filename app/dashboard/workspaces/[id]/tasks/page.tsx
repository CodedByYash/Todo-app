import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkspaceTasks } from "@/components/workspaces/WorkspaceTasks";
import { db } from "@/lib/db";
import { Task } from "@/components/tasks/TaskList";

export default async function WorkspaceTasksPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Get workspace
  const workspace = await db.workspace.findFirst({
    where: {
      id: params.id,
      members: {
        some: {
          userId: dbUser.id,
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  // Get tasks for this workspace
  const tasks = await db.tasks.findMany({
    where: {
      workspaceId: params.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add type assertion to match the Task type
  const typedTasks = tasks as unknown as Task[];

  if (!typedTasks) {
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{workspace.name} Tasks</h1>
      <WorkspaceTasks
        workspace={workspace}
        initialTasks={typedTasks}
        userId={dbUser.id}
      />
    </div>
  );
}
