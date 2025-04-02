import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Task creation schema
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().transform((str) => new Date(str)),
  workspaceId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createTaskSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    const task = await db.tasks.create({
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description,
        priority: validatedData.data.priority,
        dueDate: validatedData.data.dueDate,
        userId: userId,
        workspaceId: validatedData.data.workspaceId,
        tags: {
          connect:
            validatedData.data.tags?.map((tagId) => ({ id: tagId })) || [],
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
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

    // Get query parameters
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");
    const completed = url.searchParams.get("completed");

    // Build filter conditions
    const where: any = { userId };

    if (workspaceId) {
      where.workspaceId = workspaceId;
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
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
