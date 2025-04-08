"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
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

const Navbar = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-gray-900/80 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Calendar className="w-8 h-8 text-indigo-500 mr-2" />
              <span
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                TaskMaster
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className={`${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className={`${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className={`${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-gray-800/50 text-gray-300 hover:text-white"
                  : "bg-gray-200/50 text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/sign-in"
              className={`${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full mr-2 ${
                isDark
                  ? "bg-gray-800/50 text-gray-300 hover:text-white"
                  : "bg-gray-200/50 text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-gray-800/50 text-gray-300 hover:text-white"
                  : "bg-gray-200/50 text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 ${
              isDark ? "bg-gray-900/90" : "bg-white/90"
            } backdrop-blur-md`}
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className={`${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className={`${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className={`${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                Contact
              </Link>
              <Link
                href="/sign-in"
                className={`${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
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

const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <HeroSection isDark={isDark} />
      <SmallSection isDark={isDark} />
    </div>
  );
};

export default LandingPage;
