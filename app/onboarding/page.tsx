import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to Task Manager!</h1>
      <p className="text-lg mb-8">
        Let's set up your account, {user.firstName}. We'll need a few details to
        get you started.
      </p>

      <OnboardingForm
        userId={user.id}
        userEmail={user.emailAddresses[0].emailAddress}
        userName={
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || null
        }
      />
    </div>
  );
}
