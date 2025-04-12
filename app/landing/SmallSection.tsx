"use client";

import Link from "next/link";
import { Users, CheckCircle, ArrowRight } from "lucide-react";

const SmallSection = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={`py-16 md:py-20 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="md:w-1/2">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Boost Your Productivity Today
            </h2>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-6 md:mb-8 text-base md:text-lg`}
            >
              Join thousands of users who have transformed their task management
              with TaskMaster Pro. Our intuitive interface and powerful features
              help you stay focused and accomplish more.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/sign-up"
                className={`${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors text-sm md:text-base`}
              >
                Start Free Trial
              </Link>
              <Link
                href="#features"
                className={`${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors text-sm md:text-base`}
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div
              className={`${
                isDark
                  ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                  : "bg-gradient-to-br from-indigo-500 to-purple-500"
              } rounded-2xl p-6 md:p-8 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      Team Collaboration
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm">
                      Work together seamlessly
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full p-1.5 md:p-2">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center bg-white/10 rounded-lg p-2 md:p-3"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 md:mr-3">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-white text-sm md:text-base">
                      Task item {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallSection;
