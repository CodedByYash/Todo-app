"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "@clerk/nextjs/server";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Badge } from "@/components/ui/badge";

// Form schemas
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, underscores and hyphens"
    ),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is required"),
  description: z.string().optional(),
  type: z.enum(["PERSONAL", "PROFESSIONAL"]),
  // Professional workspace fields
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  companyDomain: z.string().optional(),
});

type OnboardingFormProps = {
  userId: string;
  userEmail: string;
  userName: string | null;
};

export function OnboardingForm({
  userId,
  userEmail,
  userName,
}: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"personal" | "workspace">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workspaceType, setWorkspaceType] = useState<
    "PERSONAL" | "PROFESSIONAL"
  >("PERSONAL");

  // Personal info form
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: userName || "",
      username: (userName || "").replace(/\s+/g, "").toLowerCase() || "",
      jobTitle: "",
      department: "",
      bio: "",
      phoneNumber: "",
    },
  });

  // Workspace form
  const workspaceForm = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: `${userName || ""}'s Workspace`,
      description: "",
      type: "PERSONAL",
      companyName: "",
      companySize: "",
      companyDomain: "",
    },
  });

  // Handle personal info submission
  async function onPersonalSubmit(values: z.infer<typeof personalInfoSchema>) {
    try {
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // Move to workspace step
      setStep("workspace");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  // Handle workspace submission
  async function onWorkspaceSubmit(values: z.infer<typeof workspaceSchema>) {
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
        throw new Error("Failed to create workspace");
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update workspace type when changed
  const handleWorkspaceTypeChange = (value: "PERSONAL" | "PROFESSIONAL") => {
    setWorkspaceType(value);
    workspaceForm.setValue("type", value);
  };

  return (
    <div className="space-y-8">
      {step === "personal" ? (
        <AnimatedGradientBorder>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Tell us a bit about yourself. This information will be visible
                on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...personalForm}>
                <form
                  onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={personalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be your unique identifier on the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={personalForm.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Product Manager"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={personalForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Engineering" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a bit about yourself"
                            className="min-h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Continue to Workspace Setup
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>
      ) : (
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
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Workspace Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      workspaceType === "PERSONAL"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setWorkspaceType("PERSONAL");
                      workspaceForm.setValue("type", "PERSONAL");
                    }}
                  >
                    <h4 className="font-medium">Personal</h4>
                    <p className="text-sm text-muted-foreground">
                      For individual use. Manage your personal tasks and
                      projects.
                    </p>
                    {workspaceType === "PERSONAL" && (
                      <Badge className="mt-2 bg-blue-500">Selected</Badge>
                    )}
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      workspaceType === "PROFESSIONAL"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setWorkspaceType("PROFESSIONAL");
                      workspaceForm.setValue("type", "PROFESSIONAL");
                    }}
                  >
                    <h4 className="font-medium">Professional</h4>
                    <p className="text-sm text-muted-foreground">
                      For teams and businesses. Collaborate with others.
                    </p>
                    {workspaceType === "PROFESSIONAL" && (
                      <Badge className="mt-2 bg-purple-500">Selected</Badge>
                    )}
                  </div>
                </div>

                {workspaceType === "PERSONAL" && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Free Tier:</strong> Personal workspaces include
                      basic features for individual task management. Upgrade
                      anytime to access advanced features.
                    </p>
                  </div>
                )}

                {workspaceType === "PROFESSIONAL" && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Free Trial:</strong> Professional workspaces
                      include a 14-day trial of all premium features. After the
                      trial period, you'll need to subscribe to continue using
                      premium features.
                    </p>
                  </div>
                )}
              </div>

              <Form {...workspaceForm}>
                <form
                  onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={workspaceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Workspace" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={workspaceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your workspace"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {workspaceType === "PROFESSIONAL" && (
                    <div className="space-y-4 border-t pt-4 mt-4">
                      <h3 className="text-lg font-medium">Company Details</h3>

                      <FormField
                        control={workspaceForm.control}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={workspaceForm.control}
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
                          control={workspaceForm.control}
                          name="companyDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Domain</FormLabel>
                              <FormControl>
                                <Input placeholder="acme.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("personal")}
                    >
                      Back to Personal Info
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="sm:w-1/2"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Creating Workspace..."
                          : "Create Workspace & Continue"}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </AnimatedGradientBorder>
      )}
    </div>
  );
}
