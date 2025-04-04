"use client";

import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/components/tasks/TaskList";

type DashboardTaskListProps = {
  initialTasks: Task[];
};

export function DashboardTaskList({ initialTasks }: DashboardTaskListProps) {
  return (
    <TaskList
      initialTasks={initialTasks}
      workspaceId=""
      onTasksChange={() => {}}
    />
  );
}
