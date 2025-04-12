import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Workspace creation schema
const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
  type: z.enum(["PERSONAL", "PROFESSIONAL"]),
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  companyDomain: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log(body);
    const validatedData = createWorkspaceSchema.safeParse(body);

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

    // If user doesn't exist, create them
    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
          firstname: user.firstName || "",
          lastname: user.lastName || "",
          username:
            user.username || user.emailAddresses[0].emailAddress.split("@")[0],
        },
      });
    }

    // For PERSONAL workspaces, check if user already has one
    if (validatedData.data.type === "PERSONAL") {
      const existingPersonalWorkspace = await db.workspace.findFirst({
        where: {
          ownerId: dbUser.id,
          type: "PERSONAL",
        },
      });

      if (existingPersonalWorkspace) {
        return NextResponse.json(
          { error: "You already have a personal workspace" },
          { status: 400 }
        );
      }
    }
    console.log("hi");
    // For PROFESSIONAL workspaces, check if user already has one
    if (validatedData.data.type === "PROFESSIONAL") {
      const existingProfessionalWorkspace = await db.workspace.findFirst({
        where: {
          ownerId: dbUser.id,
          type: "PROFESSIONAL",
        },
      });

      if (existingProfessionalWorkspace) {
        return NextResponse.json(
          { error: "You can only create one free professional workspace." },
          { status: 400 }
        );
      }
    }

    // Create workspace
    const workspace = await db.workspace.create({
      data: {
        name: validatedData.data.name,
        description: validatedData.data.description,
        type: validatedData.data.type,
        companyName: validatedData.data.companyName,
        companySize: validatedData.data.companySize,
        companyDomain: validatedData.data.companyDomain,
        ownerId: dbUser.id,
        // For professional workspaces, set trial period
        ...(validatedData.data.type === "PROFESSIONAL" && {
          subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        }),
        // Create owner as member with OWNER role
        members: {
          create: {
            userId: dbUser.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get workspaces where user is a member
    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
