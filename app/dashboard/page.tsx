import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      <p>Welcome back, {user.firstName}!</p>
      {/* Add your dashboard content here */}
    </div>
  );
}
