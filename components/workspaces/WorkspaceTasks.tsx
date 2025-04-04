"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Task } from "@/components/tasks/TaskList";

type Workspace = {
  id: string;
  name: string;
};

type WorkspaceTasksProps = {
  workspace: Workspace;
  initialTasks: Task[];
  userId: string;
};

export function WorkspaceTasks({
  workspace,
  initialTasks,
  userId,
}: WorkspaceTasksProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Workspace Tasks</p>
          <h2 className="text-2xl font-bold">{workspace.name}</h2>
        </div>
        <Button asChild>
          <Link href={`/dashboard/workspaces/${workspace.id}/tasks/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <TaskList
        initialTasks={tasks}
        workspaceId={workspace.id}
        onTasksChange={(updatedTasks) => {
          setTasks(updatedTasks);
          router.refresh();
        }}
      />
    </div>
  );
}
