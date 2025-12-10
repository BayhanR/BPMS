import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Birden fazla task'ın sırasını güncelle (Kanban column reorder)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tasks } = body; // Array of { id, order, status }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "Tasks array is required" },
        { status: 400 }
      );
    }

    // Batch update
    const updates = tasks.map((task: { id: string; order: number; status?: string }) =>
      prisma.task.update({
        where: { id: task.id },
        data: {
          order: task.order,
          ...(task.status && { status: task.status as any }),
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, updated: tasks.length });
  } catch (error) {
    console.error("[TASKS_REORDER] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

