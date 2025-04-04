import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { WorkspaceDashboard } from "@/components/workspaces/WorkspaceDashboard";

export default async function WorkspacePage({
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

  // Get workspace with tasks and members
  const workspace = await db.workspace.findFirst({
    where: {
      id: params.id,
      members: {
        some: {
          userId: dbUser.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  // Get recent tasks for this workspace
  const recentTasks = await db.task.findMany({
    where: {
      workspaceId: params.id,
    },
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <WorkspaceDashboard
        workspace={workspace}
        recentTasks={recentTasks}
        currentUserId={dbUser.id}
      />
    </div>
  );
}
