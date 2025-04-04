import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkspaceSettings } from "@/components/workspaces/WorkspaceSettings";
import { db } from "@/lib/db";

export default async function WorkspaceSettingsPage({
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
          role: { in: ["OWNER", "ADMIN"] },
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Workspace Settings</h1>
      <WorkspaceSettings workspace={workspace} />
    </div>
  );
}
