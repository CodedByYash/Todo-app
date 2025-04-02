import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Welcome to Task Manager!</h1>
      <p>Let's set up your account, {user.firstName}.</p>
      {/* Add your onboarding form here */}
    </div>
  );
}
