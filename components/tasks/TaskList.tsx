"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskItem } from "@/components/tasks/TaskItem";

// Define task type
export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "no_priority" | "low" | "medium" | "high";
  dueDate: string | Date | number;
  tags: { id: string; name: string }[];
  createdAt: string;
};

// Filter and sort types
type FilterState = {
  status: "all" | "completed" | "pending";
  priority: "all" | "low" | "medium" | "high";
  dueDate: "all" | "today" | "week" | "month" | "overdue";
  tags: string[];
};

type SortOption = "newest" | "oldest" | "priority" | "dueDate";

type TaskListProps = {
  initialTasks: Task[];
  workspaceId: string | null;
  onTasksChange: (updatedTasks: Task[]) => void;
};

export function TaskList({
  initialTasks,
  workspaceId,
  onTasksChange,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    dueDate: "all",
    tags: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [availableTags, setAvailableTags] = useState<
    { id: string; name: string }[]
  >([]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);

        // Extract unique tags
        const tags = new Set<string>();
        const tagObjects: { id: string; name: string }[] = [];

        (Array.isArray(data) ? data : []).forEach((task: Task) => {
          task.tags?.forEach((tag) => {
            if (!tags.has(tag.id)) {
              tags.add(tag.id);
              tagObjects.push(tag);
            }
          });
        });

        setAvailableTags(tagObjects);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((task) =>
        filters.status === "completed" ? task.completed : !task.completed
      );
    }

    // Filter by priority
    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // Filter by due date
    if (filters.dueDate !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);

      const monthLater = new Date(today);
      monthLater.setMonth(monthLater.getMonth() + 1);

      result = result.filter((task) => {
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);

        if (filters.dueDate === "today") {
          return (
            dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
          );
        } else if (filters.dueDate === "week") {
          return dueDate >= today && dueDate <= weekLater;
        } else if (filters.dueDate === "month") {
          return dueDate >= today && dueDate <= monthLater;
        } else if (filters.dueDate === "overdue") {
          return dueDate < today && !task.completed;
        }
        return true;
      });
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter(
        (task) =>
          task.tags?.some((tag) => filters.tags.includes(tag.id)) || false
      );
    }

    // Sort tasks
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2, no_priority: 3 };
        return (
          (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
        );
      } else if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    setFilteredTasks(result);
  }, [tasks, filters, sortBy]);

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Update local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      dueDate: "all",
      tags: [],
    });
    setSortBy("newest");
  };

  // Toggle tag filter
  const toggleTagFilter = (tagId: string) => {
    setFilters((prev) => {
      const newTags = prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId];

      return { ...prev, tags: newTags };
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/50">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
          {error}
        </h3>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Your Tasks</h2>

        <div className="flex flex-wrap gap-2">
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className={filters.status === "all" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: "all" }))
                  }
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.status === "completed" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: "completed" }))
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.status === "pending" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: "pending" }))
                  }
                >
                  <Circle className="mr-2 h-4 w-4" />
                  Pending
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Priority
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className={filters.priority === "all" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priority: "all" }))
                  }
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.priority === "high" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priority: "high" }))
                  }
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                  High
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.priority === "medium" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priority: "medium" }))
                  }
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.priority === "low" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priority: "low" }))
                  }
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  Low
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Due Date
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className={filters.dueDate === "all" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dueDate: "all" }))
                  }
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.dueDate === "today" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dueDate: "today" }))
                  }
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.dueDate === "week" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dueDate: "week" }))
                  }
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.dueDate === "month" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dueDate: "month" }))
                  }
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.dueDate === "overdue" ? "bg-accent" : ""}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dueDate: "overdue" }))
                  }
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortBy === "newest" || sortBy === "oldest" ? (
                  sortBy === "newest" ? (
                    <SortDesc className="mr-2 h-4 w-4" />
                  ) : (
                    <SortAsc className="mr-2 h-4 w-4" />
                  )
                ) : sortBy === "priority" ? (
                  <AlertTriangle className="mr-2 h-4 w-4" />
                ) : (
                  <Calendar className="mr-2 h-4 w-4" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={sortBy === "newest" ? "bg-accent" : ""}
                onClick={() => setSortBy("newest")}
              >
                <SortDesc className="mr-2 h-4 w-4" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "oldest" ? "bg-accent" : ""}
                onClick={() => setSortBy("oldest")}
              >
                <SortAsc className="mr-2 h-4 w-4" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "priority" ? "bg-accent" : ""}
                onClick={() => setSortBy("priority")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Priority (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "dueDate" ? "bg-accent" : ""}
                onClick={() => setSortBy("dueDate")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Due Date (Earliest First)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tags filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Tag className="h-4 w-4 mr-1" />
          {availableTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={filters.tags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTagFilter(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Task count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or create a new task.
          </p>
          <Button className="mt-4" asChild>
            <a href="/tasks/new">Create Task</a>
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  task={task}
                  onToggleComplete={() => toggleTaskCompletion(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
