import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
