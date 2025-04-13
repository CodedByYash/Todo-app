"use client";

import { motion } from "framer-motion";
import SubtaskItem from "./SubtaskItem";

interface Subtask {
  title: string;
  completed: boolean;
}

interface Task {
  title: string;
  description: string;
  category: string;
  progress: number;
  subtasks: Subtask[];
}

const categoryColors: Record<string, string> = {
  Marketing: "bg-orange-200",
  Design: "bg-pink-200",
  Development: "bg-blue-200",
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const color = categoryColors[task.category] || "bg-gray-200";

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 border-l-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      style={{ borderColor: "rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{task.title}</h2>
        <span className={`text-sm px-3 py-1 rounded-full ${color}`}>
          {task.category}
        </span>
      </div>
      <p className="text-gray-500 mb-4">{task.description}</p>
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Subtasks</h3>
        <ul className="space-y-2">
          {task.subtasks.map((subtask, i) => (
            <SubtaskItem key={i} subtask={subtask} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TaskCard;
