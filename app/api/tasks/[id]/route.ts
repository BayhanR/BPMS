import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { startTime: "desc" },
        },
        attachments: {
          orderBy: { createdAt: "desc" },
        },
        dependencies: {
          include: {
            dependencyTask: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        dependents: {
          include: {
            dependentTask: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS] Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (projectId !== undefined) updateData.projectId = projectId;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (startTime !== undefined) updateData.startTime = startTime ? new Date(startTime) : null;
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
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
      },
    });

    // Update labels if provided
    if (labels !== undefined) {
      await prisma.taskLabel.deleteMany({
        where: { taskId: params.id },
      });

      if (labels.length > 0) {
        await prisma.taskLabel.createMany({
          data: labels.map((labelId: string) => ({
            taskId: params.id,
            labelId,
          })),
        });
      }
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "task_updated",
        entityType: "Task",
        entityId: task.id,
        metadata: { title: task.title },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS] Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      select: { id: true, title: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "task_deleted",
        entityType: "Task",
        entityId: task.id,
        metadata: { title: task.title },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TASKS] Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

