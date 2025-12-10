import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

// PATCH: Task status ve order güncelle (Kanban drag-drop için)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, order } = body;

    // Geçerli status kontrolü
    if (status && !["todo", "doing", "done"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Task'ı bul
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            workspace: {
              include: {
                members: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Kullanıcının workspace'e erişimi var mı
    const membership = existingTask.project.workspace.members[0];
    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Viewer sadece görüntüleyebilir, düzenleyemez
    if (membership.role === "viewer") {
      return NextResponse.json(
        { error: "Viewers cannot update tasks" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status as TaskStatus;
    if (order !== undefined) updateData.order = order;

    const task = await prisma.task.update({
      where: { id },
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
      },
    });

    // Activity log
    if (status !== undefined && status !== existingTask.status) {
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "task_status_changed",
          entityType: "Task",
          entityId: task.id,
          metadata: {
            title: task.title,
            fromStatus: existingTask.status,
            toStatus: status,
          },
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASK_STATUS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

