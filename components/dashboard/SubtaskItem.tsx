"use client";

import { motion } from "framer-motion";

interface Subtask {
  title: string;
  completed: boolean;
}

const SubtaskItem: React.FC<{ subtask: Subtask }> = ({ subtask }) => {
  return (
    <motion.li
      className="flex items-center gap-2 text-sm"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <input
        type="checkbox"
        checked={subtask.completed}
        readOnly
        className="accent-green-500"
      />
      <span className={subtask.completed ? "line-through text-gray-400" : ""}>
        {subtask.title}
      </span>
    </motion.li>
  );
};

export default SubtaskItem;
