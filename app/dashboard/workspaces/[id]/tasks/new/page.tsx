import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TaskForm } from "@/components/tasks/TaskForm";

export default async function NewWorkspaceTaskPage({
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

  // Check if user is a member of the workspace
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

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">
        Create New Task in {workspace.name}
      </h1>
      <TaskForm workspaceId={workspace.id} />
    </div>
  );
}
