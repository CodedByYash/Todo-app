import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["no_priority", "low", "medium", "high"]),
  dueDate: z.string().datetime().optional().nullable(),
  workspaceId: z.string(), // Required, but we'll transform "personal"
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Received task data:", data);

    const validatedData = createTaskSchema.safeParse(data);
    if (!validatedData.success) {
      console.log("Validation errors:", validatedData.error.errors);
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let finalWorkspaceId = validatedData.data.workspaceId;

    // Handle personal tasks
    if (validatedData.data.workspaceId === "personal") {
      finalWorkspaceId = `${userId}0`; // e.g., "user_abc1230"

      // Ensure a personal workspace exists
      await db.workspace.upsert({
        where: { id: finalWorkspaceId },
        update: {},
        create: {
          id: finalWorkspaceId,
          name: `${dbUser.username || "User"}'s Personal Space`,
          type: "PERSONAL",
          ownerId: dbUser.id,
        },
      });
    } else {
      // Validate workspaceId for non-personal tasks
      const workspace = await db.workspace.findUnique({
        where: { id: validatedData.data.workspaceId },
      });
      if (!workspace) {
        return NextResponse.json(
          {
            error: `Workspace with ID "${validatedData.data.workspaceId}" not found`,
          },
          { status: 400 }
        );
      }
    }

    const dueDate = validatedData.data.dueDate || null;

    const task = await db.tasks.create({
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description || "",
        priority: validatedData.data.priority,
        dueDate,
        userId: dbUser.id,
        workspaceId: finalWorkspaceId, // Always a valid string
        tags: {
          connect:
            validatedData.data.tags?.map((tagId) => ({ id: tagId })) || [],
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET route (updated to handle personal workspaceId)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");
    const completed = url.searchParams.get("completed");

    const where: any = { userId };

    if (workspaceId === "personal") {
      where.workspaceId = `${userId}0`; // Personal tasks
    } else if (workspaceId) {
      where.workspaceId = workspaceId; // Workspace tasks
    }

    if (completed !== null) {
      where.completed = completed === "true";
    }

    const tasks = await db.tasks.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
