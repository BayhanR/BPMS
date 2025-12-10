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
    const workspaceId = searchParams.get("workspaceId");

    // Workspace kontrolü
    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // Kullanıcının workspace'e erişimi var mı
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Progress hesapla
    const projectsWithProgress = projects.map((project) => {
      const totalTasks = project.tasks.length;
      const doneTasks = project.tasks.filter((t) => t.status === "done").length;
      const doingTasks = project.tasks.filter((t) => t.status === "doing").length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        taskCount: project._count.tasks,
        progress,
        status:
          progress === 100
            ? "Tamamlandı"
            : doingTasks > 0
            ? "Devam Ediyor"
            : totalTasks > 0
            ? "Planlama"
            : "Boş",
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });

    return NextResponse.json(projectsWithProgress);
  } catch (error) {
    console.error("[PROJECTS] Error fetching projects:", error);
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
    const { name, description, color, icon, workspaceId } = body;

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: "Name and workspaceId are required" },
        { status: 400 }
      );
    }

    // Kullanıcının workspace'e erişimi ve yazma yetkisi var mı
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (membership.role === "viewer") {
      return NextResponse.json(
        { error: "Viewers cannot create projects" },
        { status: 403 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || "#ff1e56",
        icon: icon || "folder",
        workspaceId,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "project_created",
        entityType: "Project",
        entityId: project.id,
        metadata: { name: project.name },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS] Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

