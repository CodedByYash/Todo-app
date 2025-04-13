"use client";

import TaskCard from "@/components/dashboard/taskCard";

const tasks = [
  {
    title: "Marketing Strategy",
    description: "Finalize Q2 campaign strategy.",
    category: "Marketing",
    progress: 80,
    subtasks: [
      { title: "Email campaign", completed: true },
      { title: "Social media posts", completed: false },
    ],
  },
  {
    title: "UI Design",
    description: "Design new dashboard UI components.",
    category: "Design",
    progress: 60,
    subtasks: [
      { title: "Dashboard layout", completed: true },
      { title: "Animation polish", completed: false },
    ],
  },
  {
    title: "Backend Setup",
    description: "Initialize database and backend API.",
    category: "Development",
    progress: 40,
    subtasks: [
      { title: "Schema creation", completed: false },
      { title: "API routes", completed: false },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        🚀 Task Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </div>
    </main>
  );
}
