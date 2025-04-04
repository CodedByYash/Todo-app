import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkspaceMembers } from "@/components/workspaces/WorkspaceMembers";
import { db } from "@/lib/db";

export default async function WorkspaceMembersPage({
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
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
              jobTitle: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  // Check if user is owner or admin
  const isAdmin = workspace.members.some(
    (member) =>
      member.userId === dbUser.id &&
      (member.role === "OWNER" || member.role === "ADMIN")
  );

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Workspace Members</h1>
      <WorkspaceMembers
        workspace={workspace}
        isAdmin={isAdmin}
        currentUserId={dbUser.id}
      />
    </div>
  );
}
