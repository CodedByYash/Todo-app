"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CheckSquare,
  Calendar,
  Users,
  Settings,
  PlusCircle,
  Briefcase,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Workspace = {
  id: string;
  name: string;
  type: "PERSONAL" | "PROFESSIONAL";
  imageUrl?: string;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch("/api/workspaces");
        if (!response.ok) {
          console.error(
            `Failed to fetch workspaces: ${response.status} ${response.statusText}`
          );
          return; // Don't try to process the response
        }

        const data = await response.json();
        setWorkspaces(Array.isArray(data) ? data : []);

        // Set active workspace (first one by default)
        if (Array.isArray(data) && data.length > 0 && !activeWorkspace) {
          setActiveWorkspace(data[0]);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "My Tasks",
      icon: CheckSquare,
      href: "/dashboard/tasks",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
    },
    {
      title: "Team",
      icon: Users,
      href: "/dashboard/team",
      badge: "Pro",
      requiresPro: true,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Workspace Selector */}
      <div className="border-b p-4">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activeWorkspace?.imageUrl} />
                    <AvatarFallback>
                      {activeWorkspace?.name.charAt(0) || "W"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">
                    {activeWorkspace?.name || "Select Workspace"}
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setActiveWorkspace(workspace)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={workspace.imageUrl} />
                    <AvatarFallback>{workspace.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{workspace.name}</span>
                  {workspace.type === "PROFESSIONAL" && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Pro
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/workspaces/new"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Workspace</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsCollapsed(false)}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={activeWorkspace?.imageUrl} />
                    <AvatarFallback>
                      {activeWorkspace?.name.charAt(0) || "W"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {activeWorkspace?.name || "Select Workspace"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            // Skip pro features if workspace is not pro
            if (item.requiresPro && activeWorkspace?.type !== "PROFESSIONAL") {
              return null;
            }

            return (
              <li key={item.href}>
                {!isCollapsed ? (
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            size="icon"
                            className="h-9 w-9"
                          >
                            <item.icon className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse/Expand Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <motion.div
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </Button>
      </div>
    </div>
  );
}
