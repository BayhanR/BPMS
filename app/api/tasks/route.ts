import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const assigneeId = searchParams.get("assigneeId");
    const dueDate = searchParams.get("dueDate");
    const status = searchParams.get("status");

    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (dueDate) {
      const date = new Date(dueDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: {
          orderBy: { order: "asc" },
        },
        timeEntries: {
          orderBy: { startTime: "desc" },
          take: 1,
        },
      },
      orderBy: [
        { dueDate: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TASKS] Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      projectId,
      assigneeId,
      dueDate,
      startDate,
      startTime,
      endTime,
      priority,
      status,
      labels,
    } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Title and projectId are required" },
        { status: 400 }
      );
    }

    // Get max order for the project
    const maxOrder = await prisma.task.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId || session.user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        priority: priority || "medium",
        status: status || "todo",
        order: (maxOrder?.order || 0) + 1,
        labels: labels
          ? {
              create: labels.map((labelId: string) => ({
                labelId,
              })),
            }
          : undefined,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "task_created",
        entityType: "Task",
        entityId: task.id,
        metadata: { title: task.title },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("[TASKS] Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

