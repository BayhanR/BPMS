import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Workspace'deki tüm kullanıcıları getir (admin only)
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

    // Admin kontrolü
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership || membership.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Tüm workspace üyelerini getir
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
      orderBy: {
        user: { createdAt: "asc" },
      },
    });

    // Kullanıcı başına istatistik ekle
    const usersWithStats = await Promise.all(
      members.map(async (member) => {
        const [activeTasks, completedTasks] = await Promise.all([
          prisma.task.count({
            where: {
              project: { workspaceId },
              assigneeId: member.userId,
              status: { not: "done" },
            },
          }),
          prisma.task.count({
            where: {
              project: { workspaceId },
              assigneeId: member.userId,
              status: "done",
            },
          }),
        ]);

        return {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          avatarUrl: member.user.avatarUrl,
          role: member.role,
          createdAt: member.user.createdAt,
          activeTasks,
          completedTasks,
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error("[ADMIN_USERS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

