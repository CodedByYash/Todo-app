"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Briefcase,
  Users,
  Settings,
  ArrowRight,
  PlusCircle,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type User = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
};

type Member = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  user: User;
};

type Workspace = {
  id: string;
  name: string;
  description: string | null;
  type: "PERSONAL" | "PROFESSIONAL";
  imageUrl: string | null;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

type WorkspaceListProps = {
  workspaces: Workspace[];
  userId: string;
};

export function WorkspaceList({ workspaces, userId }: WorkspaceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "personal" | "professional"
  >("all");

  // Filter workspaces based on search query and active tab
  const filteredWorkspaces = workspaces.filter((workspace) => {
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workspace.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "personal")
      return matchesSearch && workspace.type === "PERSONAL";
    if (activeTab === "professional")
      return matchesSearch && workspace.type === "PROFESSIONAL";

    return matchesSearch;
  });

  // Check if user is admin or owner of a workspace
  const isAdminOrOwner = (workspace: Workspace) => {
    return workspace.members.some(
      (member) =>
        member.user.id === userId &&
        (member.role === "OWNER" || member.role === "ADMIN")
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workspaces..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/dashboard/workspaces/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workspace
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList>
          <TabsTrigger value="all">All Workspaces</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-center text-muted-foreground py-8">
                  No workspaces found. Create a new workspace to get started.
                </p>
              </div>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  isAdmin={isAdminOrOwner(workspace)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-center text-muted-foreground py-8">
                  No personal workspaces found.
                </p>
              </div>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  isAdmin={isAdminOrOwner(workspace)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="professional" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-center text-muted-foreground py-8">
                  No professional workspaces found.
                </p>
              </div>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  isAdmin={isAdminOrOwner(workspace)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Workspace Card Component
function WorkspaceCard({
  workspace,
  isAdmin,
}: {
  workspace: Workspace;
  isAdmin: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge
              variant={workspace.type === "PERSONAL" ? "secondary" : "default"}
            >
              {workspace.type === "PERSONAL" ? "Personal" : "Professional"}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {format(new Date(workspace.updatedAt), "MMM d, yyyy")}
            </div>
          </div>
          <CardTitle className="mt-2">{workspace.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {workspace.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {workspace.members.length}{" "}
              {workspace.members.length === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="flex -space-x-2 mt-4">
            {workspace.members.slice(0, 5).map((member) => (
              <Avatar
                key={member.id}
                className="h-8 w-8 border-2 border-background"
              >
                <AvatarImage src={member.user.imageUrl || undefined} />
                <AvatarFallback>
                  {member.user.name?.charAt(0) ||
                    member.user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.members.length > 5 && (
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback>+{workspace.members.length - 5}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/workspaces/${workspace.id}`}>
              View Workspace
            </Link>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
