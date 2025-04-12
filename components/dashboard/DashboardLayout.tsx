"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  CheckSquare,
  BarChart,
  Settings,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Search,
  Clock,
  Tag,
  Filter,
  ChevronDown,
  Plus,
  Crown,
  User,
  Palette,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
  };
}

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  const [theme, setTheme] = useState("dark");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [accentColor, setAccentColor] = useState("indigo");
  const pathname = usePathname();

  const isDark = theme === "dark";

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    const savedAccent = localStorage.getItem("accentColor") || "indigo";
    setTheme(savedTheme);
    setAccentColor(savedAccent);

    // Check if sidebar is collapsed
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsCollapsed(collapsed);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const changeAccentColor = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
  };

  const getAccentClasses = (isActive: boolean) => {
    const colorMap: Record<string, { active: string; hover: string }> = {
      indigo: {
        active: isDark
          ? "bg-indigo-600 text-white"
          : "bg-indigo-100 text-indigo-600",
        hover: isDark ? "hover:bg-indigo-700" : "hover:bg-indigo-200",
      },
      emerald: {
        active: isDark
          ? "bg-emerald-600 text-white"
          : "bg-emerald-100 text-emerald-600",
        hover: isDark ? "hover:bg-emerald-700" : "hover:bg-emerald-200",
      },
      amber: {
        active: isDark
          ? "bg-amber-600 text-white"
          : "bg-amber-100 text-amber-600",
        hover: isDark ? "hover:bg-amber-700" : "hover:bg-amber-200",
      },
      rose: {
        active: isDark ? "bg-rose-600 text-white" : "bg-rose-100 text-rose-600",
        hover: isDark ? "hover:bg-rose-700" : "hover:bg-rose-200",
      },
      purple: {
        active: isDark
          ? "bg-purple-600 text-white"
          : "bg-purple-100 text-purple-600",
        hover: isDark ? "hover:bg-purple-700" : "hover:bg-purple-200",
      },
    };

    return isActive
      ? colorMap[accentColor].active
      : `${isDark ? "text-gray-300" : "text-gray-600"} ${
          colorMap[accentColor].hover
        }`;
  };

  const getSidebarGradient = () => {
    const gradients: Record<string, string> = {
      indigo: isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-indigo-900/30"
        : "bg-gradient-to-b from-white via-gray-100 to-indigo-100/30",
      emerald: isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-emerald-900/30"
        : "bg-gradient-to-b from-white via-gray-100 to-emerald-100/30",
      amber: isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-amber-900/30"
        : "bg-gradient-to-b from-white via-gray-100 to-amber-100/30",
      rose: isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-rose-900/30"
        : "bg-gradient-to-b from-white via-gray-100 to-rose-100/30",
      purple: isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-purple-900/30"
        : "bg-gradient-to-b from-white via-gray-100 to-purple-100/30",
    };

    return gradients[accentColor];
  };

  const getMainBackground = () => {
    const backgrounds: Record<string, string> = {
      indigo: isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-gray-50 to-indigo-50/30",
      emerald: isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-gray-50 to-emerald-50/30",
      amber: isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-gray-50 to-amber-50/30",
      rose: isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-gray-50 to-rose-50/30",
      purple: isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-gray-50 to-purple-50/30",
    };

    return backgrounds[accentColor];
  };

  const navItems = [
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
    {
      icon: CheckSquare,
      label: "Today's Tasks",
      href: "/dashboard/tasks/today",
    },
    { icon: Clock, label: "Upcoming Tasks", href: "/dashboard/tasks/upcoming" },
    { icon: Search, label: "Search", href: "/dashboard/search" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Tag, label: "Tags", href: "/dashboard/tags" },
    { icon: Filter, label: "Filters", href: "/dashboard/filters" },
  ];

  const workspaces = [
    { id: "1", name: "Personal", type: "personal" },
    { id: "2", name: "Work", type: "professional" },
    { id: "3", name: "Side Projects", type: "personal" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : "U";

  return (
    <div className={theme}>
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } h-screen fixed left-0 top-0 transition-all duration-500 ease-in-out ${getSidebarGradient()} shadow-lg z-50 border-r ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div
            className={`p-4 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer group">
                    <Avatar
                      className={`h-8 w-8 mr-2 ring-2 ${
                        isDark ? "ring-gray-700" : "ring-gray-200"
                      } 
                    group-hover:ring-${accentColor}-500 transition-all duration-300`}
                    >
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.emailAddress}
                        </p>
                      </div>
                    )}
                    {!isCollapsed && (
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform 
                      group-hover:text-${accentColor}-400 duration-300 group-hover:scale-110`}
                      />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-md ml-4 ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-200 text-gray-600"
                        } transition-all duration-300 hover:scale-110`}
                      >
                        {isCollapsed ? (
                          <Menu className="w-5 h-5 " />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent
                  align="start"
                  className={`w-56 ${
                    isDark
                      ? "bg-gray-800 text-gray-200"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    className={isDark ? "bg-gray-700" : "bg-gray-200"}
                  />
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create Workspace</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    className={isDark ? "bg-gray-700" : "bg-gray-200"}
                  />
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Workspace Selector */}
          {!isCollapsed && (
            <div
              className={`p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isDark ? "outline" : "outline"}
                    className={`w-full justify-between group ${
                      isDark
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    } transition-all duration-300`}
                  >
                    <span className="font-medium">Personal</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className={`w-56 ${
                    isDark
                      ? "bg-gray-800 text-gray-200"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      className={`cursor-pointer flex items-center ${
                        workspace.id === "1"
                          ? `text-${accentColor}-500 font-medium`
                          : ""
                      } hover:bg-opacity-10 hover:bg-gray-500`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          workspace.type === "personal"
                            ? `bg-${accentColor}-500`
                            : "bg-amber-500"
                        }`}
                      ></div>
                      <span>{workspace.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator
                    className={isDark ? "bg-gray-700" : "bg-gray-200"}
                  />
                  <DropdownMenuItem className="cursor-pointer hover:bg-opacity-10 hover:bg-gray-500">
                    <Plus className={`mr-2 h-4 w-4 text-${accentColor}-500`} />
                    <span>Create New Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <TooltipProvider>
              <ul className="space-y-1 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ${getAccentClasses(
                              active
                            )} ${active ? "" : "hover:bg-opacity-10"}`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                active
                                  ? ""
                                  : `transition-transform duration-300 group-hover:scale-110`
                              }`}
                            />
                            {!isCollapsed && (
                              <span
                                className={`ml-3 ${
                                  active ? "font-medium" : ""
                                }`}
                              >
                                {item.label}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </TooltipProvider>
          </nav>

          {/* Footer */}
          <div
            className={`p-4 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleTheme}
                      className={`p-2 rounded-md ${
                        isDark
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                      } transition-all duration-300 hover:scale-110`}
                    >
                      {isDark ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`p-2 rounded-md ${
                            isDark
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-200 text-gray-600"
                          } transition-all duration-300 hover:scale-110`}
                        >
                          <Palette className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={`p-2 ${
                          isDark
                            ? "bg-gray-800 text-gray-200"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <div className="grid grid-cols-5 gap-1">
                          {["indigo", "emerald", "amber", "rose", "purple"].map(
                            (color) => (
                              <button
                                key={color}
                                onClick={() => changeAccentColor(color)}
                                className={`w-6 h-6 rounded-full bg-${color}-500 ${
                                  accentColor === color
                                    ? "ring-2 ring-white ring-opacity-60"
                                    : ""
                                } transition-transform hover:scale-110`}
                                aria-label={`${color} theme`}
                              />
                            )
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="top">Theme Colors</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-500 ${getMainBackground()} ${
          isDark ? "text-white" : "text-gray-900"
        } ${isCollapsed ? "ml-16" : "ml-64"} p-4 md:p-6`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
