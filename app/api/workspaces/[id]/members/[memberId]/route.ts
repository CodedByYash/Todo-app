import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Member update schema
const updateMemberSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; memberId: string } }
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
    const userMembership = await db.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: user.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have permission to update members" },
        { status: 403 }
      );
    }

    // Get the member to update
    const memberToUpdate = await db.workspaceMember.findUnique({
      where: {
        id: params.memberId,
        workspaceId: params.id,
      },
    });

    if (!memberToUpdate) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Cannot update the owner's role
    if (memberToUpdate.role === "OWNER") {
      return NextResponse.json(
        { error: "Cannot change the owner's role" },
        { status: 400 }
      );
    }

    // Admin can only update members and guests, not other admins
    if (userMembership.role === "ADMIN" && memberToUpdate.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admins cannot update other admins" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateMemberSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Update member role
    const updatedMember = await db.workspaceMember.update({
      where: {
        id: params.memberId,
      },
      data: {
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

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; memberId: string } }
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
    const userMembership = await db.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: user.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have permission to remove members" },
        { status: 403 }
      );
    }

    // Get the member to remove
    const memberToRemove = await db.workspaceMember.findUnique({
      where: {
        id: params.memberId,
        workspaceId: params.id,
      },
    });

    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Cannot remove the owner
    if (memberToRemove.role === "OWNER") {
      return NextResponse.json(
        { error: "Cannot remove the workspace owner" },
        { status: 400 }
      );
    }

    // Admin can only remove members and guests, not other admins
    if (userMembership.role === "ADMIN" && memberToRemove.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admins cannot remove other admins" },
        { status: 403 }
      );
    }

    // Remove member
    await db.workspaceMember.delete({
      where: {
        id: params.memberId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
