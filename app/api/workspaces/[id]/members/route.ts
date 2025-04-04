import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Member invitation schema
const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]).default("MEMBER"),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is a member of the workspace
    const membership = await db.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You don't have access to this workspace" },
        { status: 403 }
      );
    }

    // Get all members of the workspace
    const members = await db.workspaceMember.findMany({
      where: {
        workspaceId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            jobTitle: true,
          },
        },
      },
      orderBy: {
        role: "asc", // OWNER first, then ADMIN, etc.
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is owner or admin of workspace
    const membership = await db.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: user.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 }
      );
    }

    // Check if workspace is professional
    const workspace = await db.workspace.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (workspace.type !== "PROFESSIONAL") {
      return NextResponse.json(
        { error: "You can only invite members to professional workspaces" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = inviteMemberSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Check if user with email exists
    let invitedUser = await db.user.findUnique({
      where: {
        email: validatedData.data.email,
      },
    });

    // If user doesn't exist, create a placeholder user
    if (!invitedUser) {
      invitedUser = await db.user.create({
        data: {
          email: validatedData.data.email,
          clerkId: "", // Will be updated when user signs up
          username: validatedData.data.email.split("@")[0], // Generate username from email
          firstname: "Invited", // Placeholder
          lastname: "User", // Placeholder
        },
      });
    }

    // Check if user is already a member
    const existingMembership = await db.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: invitedUser.id,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a member of this workspace" },
        { status: 400 }
      );
    }

    // Add user to workspace
    const newMember = await db.workspaceMember.create({
      data: {
        workspaceId: params.id,
        userId: invitedUser.id,
        role: validatedData.data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    // TODO: Send invitation email

    return NextResponse.json(newMember);
  } catch (error) {
    console.error("Error inviting member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
