import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Task update schema
const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  completed: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
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

    const task = await db.tasks.findUnique({
      where: {
        id: params.id,
        userId,
      },
      include: {
        tags: true,
        subTasks: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateTaskSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Check if task exists and belongs to user
    const existingTask = await db.tasks.findUnique({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task
    const updatedTask = await db.tasks.update({
      where: {
        id: params.id,
      },
      data: {
        ...(validatedData.data.title && { title: validatedData.data.title }),
        ...(validatedData.data.description && {
          description: validatedData.data.description,
        }),
        ...(validatedData.data.priority && {
          priority: validatedData.data.priority,
        }),
        ...(validatedData.data.dueDate && {
          dueDate: validatedData.data.dueDate,
        }),
        ...(validatedData.data.completed !== undefined && {
          completed: validatedData.data.completed,
        }),
        ...(validatedData.data.tags && {
          tags: {
            set: [],
            connect: validatedData.data.tags.map((tagId) => ({ id: tagId })),
          },
        }),
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if task exists and belongs to user
    const existingTask = await db.tasks.findUnique({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Delete task
    await db.tasks.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
