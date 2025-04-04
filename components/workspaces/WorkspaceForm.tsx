"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";

// Form schema
const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is required"),
  description: z.string().optional(),
  type: z.enum(["PERSONAL", "PROFESSIONAL"]),
  // Professional workspace fields
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  companyDomain: z.string().optional(),
});

export function WorkspaceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workspaceType, setWorkspaceType] = useState<
    "PERSONAL" | "PROFESSIONAL"
  >("PERSONAL");

  // Workspace form
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "PERSONAL",
      companyName: "",
      companySize: "",
      companyDomain: "",
    },
  });

  // Handle workspace submission
  async function onSubmit(values: z.infer<typeof workspaceSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create workspace");
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating workspace:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update workspace type when changed
  const handleWorkspaceTypeChange = (value: "PERSONAL" | "PROFESSIONAL") => {
    setWorkspaceType(value);
    form.setValue("type", value);
  };

  return (
    <AnimatedGradientBorder>
      <Card>
        <CardHeader>
          <CardTitle>Create Your Workspace</CardTitle>
          <CardDescription>
            Set up your workspace to organize your tasks. You can create a
            personal workspace or a professional one for your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="PERSONAL"
            value={workspaceType}
            onValueChange={(value) =>
              handleWorkspaceTypeChange(value as "PERSONAL" | "PROFESSIONAL")
            }
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="PERSONAL">Personal</TabsTrigger>
              <TabsTrigger value="PROFESSIONAL">Professional</TabsTrigger>
            </TabsList>
            <TabsContent value="PERSONAL" className="mt-4">
              <p className="text-sm text-muted-foreground">
                A personal workspace is perfect for managing your individual
                tasks and projects. You can create one personal workspace for
                free.
              </p>
            </TabsContent>
            <TabsContent value="PROFESSIONAL" className="mt-4">
              <p className="text-sm text-muted-foreground">
                A professional workspace allows you to collaborate with team
                members. You can try a professional workspace for free for 14
                days, after which a subscription is required.
              </p>
            </TabsContent>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Workspace" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed for your
                      workspace.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your workspace..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of what this workspace is for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {workspaceType === "PROFESSIONAL" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Professional Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">
                                1-10 employees
                              </SelectItem>
                              <SelectItem value="11-50">
                                11-50 employees
                              </SelectItem>
                              <SelectItem value="51-200">
                                51-200 employees
                              </SelectItem>
                              <SelectItem value="201-500">
                                201-500 employees
                              </SelectItem>
                              <SelectItem value="501+">
                                501+ employees
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="education">
                                Education
                              </SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">
                                Manufacturing
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Workspace"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AnimatedGradientBorder>
  );
}
