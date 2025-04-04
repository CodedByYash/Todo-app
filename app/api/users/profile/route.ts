import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from your database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Check if user exists in our database
    let dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create user if they don't exist
      dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          name: validatedData.data.name || `${user.firstName} ${user.lastName}`,
          username:
            validatedData.data.name?.replace(/\s+/g, "").toLowerCase() ||
            `user${Date.now()}`,
          firstname: user.firstName || "User",
          lastname: user.lastName || "Name",
          jobTitle: validatedData.data.jobTitle,
          department: validatedData.data.department,
          bio: validatedData.data.bio,
          phoneNumber: validatedData.data.phoneNumber,
        },
      });
    } else {
      // Update existing user
      dbUser = await db.user.update({
        where: { clerkId: userId },
        data: validatedData.data,
      });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
