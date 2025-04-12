"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  BarChart,
  ListTodo,
  Target,
  Zap,
  Users,
  Bell,
  Settings,
  LucideIcon,
} from "lucide-react";

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
  isDark?: boolean;
}

const FloatingIcon = ({
  icon: Icon,
  className = "",
  delay = 0,
  isDark = true,
}: FloatingIconProps) => {
  return (
    <motion.div
      initial={{ y: 0, x: 0 }}
      animate={{
        y: [0, -15, 0],
        x: [0, 5, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
      className={className}
    >
      <Icon
        className={`w-8 h-8 ${isDark ? "text-white/80" : "text-indigo-600/80"}`}
      />
    </motion.div>
  );
};

const HeroSection = ({ isDark }: { isDark: boolean }) => {
  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Floating Icons */}
      <div className="absolute top-20 left-20">
        <FloatingIcon icon={Calendar} delay={0} isDark={isDark} />
      </div>
      <div className="absolute top-40 right-20">
        <FloatingIcon icon={ListTodo} delay={0.5} isDark={isDark} />
      </div>
      <div className="absolute bottom-40 left-20">
        <FloatingIcon icon={Target} delay={1} isDark={isDark} />
      </div>
      <div className="absolute bottom-20 right-20">
        <FloatingIcon icon={Zap} delay={1.5} isDark={isDark} />
      </div>
      <div className="absolute top-1/3 left-1/4">
        <FloatingIcon icon={Users} delay={2} isDark={isDark} />
      </div>
      <div className="absolute bottom-1/3 right-1/4">
        <FloatingIcon icon={Bell} delay={2.5} isDark={isDark} />
      </div>
      <div className="absolute top-1/2 left-1/3">
        <FloatingIcon icon={Settings} delay={3} isDark={isDark} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-24 h-24 ${
                  isDark ? "bg-white/10" : "bg-indigo-100"
                } backdrop-blur-lg rounded-full flex items-center justify-center`}
              >
                <Calendar
                  className={`w-12 h-12 ${
                    isDark ? "text-white" : "text-indigo-600"
                  }`}
                />
              </motion.div>
            </div>

            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent ${
                isDark
                  ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
              }`}
            >
              TaskMaster Pro
            </h1>

            <p
              className={`text-lg md:text-xl mb-12 ${
                isDark ? "text-gray-200" : "text-gray-700"
              } max-w-2xl mx-auto leading-relaxed`}
            >
              Transform your productivity with our intelligent task management
              system. Stay organized, meet deadlines, and achieve more.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
              {[
                { icon: CheckCircle, text: "Smart Task Management" },
                { icon: Clock, text: "Real-time Updates" },
                { icon: BarChart, text: "Progress Analytics" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`flex items-center gap-2 ${
                    isDark ? "bg-white/10" : "bg-indigo-100"
                  } backdrop-blur-lg px-3 py-1.5 md:px-4 md:py-2 rounded-full`}
                >
                  <item.icon
                    className={`w-4 h-4 md:w-5 md:h-5 ${
                      isDark ? "text-blue-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`text-sm md:text-base ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/sign-up"
                className={`${
                  isDark
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                } text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full transition-all shadow-lg hover:shadow-xl`}
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
