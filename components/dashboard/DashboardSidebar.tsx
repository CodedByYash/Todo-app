"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  CheckSquare,
  Calendar,
  Users,
  Settings,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar({ isCollapsed = true }) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const navItems = [
    { title: "Dashboard", icon: Home, href: "/dashboard" },
    { title: "My Tasks", icon: CheckSquare, href: "/dashboard/tasks" },
    { title: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
    {
      title: "Team",
      icon: Users,
      href: "/dashboard/team",
      requiresPro: true,
    },
    { title: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div
      className={`flex flex-col border-r bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } fixed top-0 left-0 h-full`}
    >
      <div className="border-b p-4">
        <Button
          variant="ghost"
          className="w-full justify-center p-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center gap-0 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/path/to/image" />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="truncate font-medium ml-2">Workspace Name</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4" />
          </div>
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && item.title}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
