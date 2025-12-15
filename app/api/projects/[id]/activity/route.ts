import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Proje var mı ve kullanıcının erişimi var mı kontrol et
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Proje ile ilgili aktiviteleri çek
    const activities = await prisma.activityLog.findMany({
      where: {
        OR: [
          { entityType: "Project", entityId: projectId },
          {
            entityType: "Task",
            entityId: {
              in: await prisma.task
                .findMany({
                  where: { projectId },
                  select: { id: true },
                })
                .then((tasks) => tasks.map((t) => t.id)),
            },
          },
        ],
      },
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
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("[PROJECT_ACTIVITY] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

