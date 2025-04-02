import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

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

      <TaskList />
    </div>
  );
}
