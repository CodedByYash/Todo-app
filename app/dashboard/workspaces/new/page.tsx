import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkspaceForm } from "@/components/workspaces/WorkspaceForm";

export default async function NewWorkspacePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Workspace</h1>
      <p className="text-lg mb-8">
        Set up a new workspace to organize your tasks and collaborate with your
        team.
      </p>

      <WorkspaceForm />
    </div>
  );
}
