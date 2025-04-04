import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { WorkspaceList } from "@/components/workspaces/WorkspaceList";

export default async function WorkspacesPage() {
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

  // Get all user's workspaces
  const workspaces = await db.workspace.findMany({
    where: {
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
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Workspaces</h1>
      <WorkspaceList workspaces={workspaces} userId={dbUser.id} />
    </div>
  );
}
