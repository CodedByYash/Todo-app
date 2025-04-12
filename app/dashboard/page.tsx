"use client";

import { Calendar, CheckSquare, BarChart } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Tasks</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-80">Completed: 18</p>
          </div>
        </div>

        <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Upcoming Events</p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-80">Next: Team Meeting</p>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Productivity</p>
              <h3 className="text-2xl font-bold mt-1">87%</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-80">+5% from last week</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <p className="font-medium">Task {item} completed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2 hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
