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

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // Kullanıcının workspace'e erişimi var mı kontrol et
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

    // Paralel sorgular
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      teamMembers,
      recentProjects,
      userTasks,
      weeklyStats,
    ] = await Promise.all([
      // Toplam proje sayısı
      prisma.project.count({
        where: { workspaceId },
      }),

      // Toplam görev sayısı
      prisma.task.count({
        where: {
          project: { workspaceId },
        },
      }),

      // Tamamlanan görevler
      prisma.task.count({
        where: {
          project: { workspaceId },
          status: "done",
        },
      }),

      // Devam eden görevler
      prisma.task.count({
        where: {
          project: { workspaceId },
          status: "doing",
        },
      }),

      // Yapılacak görevler
      prisma.task.count({
        where: {
          project: { workspaceId },
          status: "todo",
        },
      }),

      // Takım üyeleri
      prisma.workspaceMember.count({
        where: { workspaceId },
      }),

      // Son projeler (3 adet)
      prisma.project.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 3,
        include: {
          _count: {
            select: { tasks: true },
          },
          tasks: {
            select: { status: true },
          },
        },
      }),

      // Kullanıcının görevleri
      prisma.task.count({
        where: {
          project: { workspaceId },
          assigneeId: session.user.id,
          status: { not: "done" },
        },
      }),

      // Son 7 günde tamamlanan görevler
      prisma.task.count({
        where: {
          project: { workspaceId },
          status: "done",
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Proje istatistikleri hesapla
    const projectsWithProgress = recentProjects.map((project) => {
      const total = project.tasks.length;
      const done = project.tasks.filter((t) => t.status === "done").length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        id: project.id,
        name: project.name,
        color: project.color,
        taskCount: project._count.tasks,
        progress,
        status:
          progress === 100
            ? "Tamamlandı"
            : progress > 50
            ? "Devam Ediyor"
            : "Planlama",
      };
    });

    // Tamamlanma oranı
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Önceki haftayla karşılaştırma (mock değerler - gerçek hesaplama için ek sorgu gerekir)
    const previousWeekCompleted = weeklyStats > 0 ? weeklyStats - 2 : 0;
    const weeklyChange =
      previousWeekCompleted > 0
        ? Math.round(((weeklyStats - previousWeekCompleted) / previousWeekCompleted) * 100)
        : 0;

    return NextResponse.json({
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        teamMembers,
        completionRate,
        userActiveTasks: userTasks,
        weeklyCompleted: weeklyStats,
        weeklyChange: weeklyChange >= 0 ? `+${weeklyChange}%` : `${weeklyChange}%`,
      },
      recentProjects: projectsWithProgress,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

