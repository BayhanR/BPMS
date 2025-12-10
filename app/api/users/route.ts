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

    // Workspace filtresi varsa workspace üyelerini getir
    if (workspaceId) {
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

      // Workspace üyelerini getir
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
            },
          },
        },
        orderBy: {
          user: { name: "asc" },
        },
      });

      // Her üye için aktif task sayısı ve son aktivite
      const usersWithStats = await Promise.all(
        members.map(async (member) => {
          const [activeTasks, lastActivity] = await Promise.all([
            prisma.task.count({
              where: {
                project: { workspaceId },
                assigneeId: member.userId,
                status: { not: "done" },
              },
            }),
            prisma.activityLog.findFirst({
              where: { userId: member.userId },
              orderBy: { createdAt: "desc" },
              select: { createdAt: true },
            }),
          ]);

          return {
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            avatarUrl: member.user.avatarUrl,
            role: member.role,
            activeTasks,
            lastActivity: lastActivity?.createdAt || member.user.createdAt,
            online: false, // WebSocket ile güncellenebilir
          };
        })
      );

      return NextResponse.json(usersWithStats);
    }

    // Workspace filtresi yoksa tüm kullanıcıları getir (basit liste)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS] Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

