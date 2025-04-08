"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high" | "no_priority";
  dueDate: string | number | Date;
  tags: { id: string; name: string }[];
  createdAt: string;
};

type TaskItemProps = {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
};

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format due date
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "PPP")
    : "No due date";

  // Check if task is overdue
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  // Priority colors
  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
    no_priority: "bg-green-100",
  };

  return (
    <>
      <motion.div
        className={`rounded-lg border p-4 ${
          task.completed ? "bg-muted/50" : ""
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onToggleComplete}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
              <span className="sr-only">
                {task.completed ? "Mark as incomplete" : "Mark as complete"}
              </span>
            </Button>

            <div className="space-y-1">
              <h3
                className={`font-medium ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p
                  className={`text-sm ${
                    task.completed ? "text-muted-foreground" : ""
                  }`}
                >
                  {task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center">
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full ${
                      priorityColors[task.priority]
                    }`}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span
                    className={`text-xs ${
                      isOverdue
                        ? "text-red-500 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formattedDueDate}
                    {isOverdue && " (Overdue)"}
                  </span>
                </div>

                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a
                  href={`/tasks/${task.id}/edit`}
                  className="flex cursor-pointer items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
