import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      taskId,
      recurrenceType,
      interval,
      daysOfWeek,
      dayOfMonth,
      endDate,
      occurrences,
    } = body;

    if (!taskId || !recurrenceType) {
      return NextResponse.json(
        { error: "taskId and recurrenceType are required" },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const recurringTask = await prisma.recurringTask.create({
      data: {
        taskId,
        recurrenceType,
        interval: interval || 1,
        daysOfWeek,
        dayOfMonth,
        endDate: endDate ? new Date(endDate) : null,
        occurrences,
      },
      include: {
        task: true,
      },
    });

    return NextResponse.json(recurringTask, { status: 201 });
  } catch (error) {
    console.error("[RECURRING] Error creating recurring task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    const where: any = {};
    if (taskId) {
      where.taskId = taskId;
    }

    const recurringTasks = await prisma.recurringTask.findMany({
      where,
      include: {
        task: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(recurringTasks);
  } catch (error) {
    console.error("[RECURRING] Error fetching recurring tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

