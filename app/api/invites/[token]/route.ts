import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Davet bilgisini al (token ile)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.usedAt) {
      return NextResponse.json({ error: "Invite already used" }, { status: 400 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });
    }

    return NextResponse.json({
      id: invite.id,
      workspace: invite.workspace,
      role: invite.role,
      email: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error("[INVITES] Error fetching invite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Daveti kabul et
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
      include: {
        workspace: true,
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.usedAt) {
      return NextResponse.json({ error: "Invite already used" }, { status: 400 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });
    }

    // Email kontrolü (eğer davet belirli bir email için oluşturulduysa)
    if (invite.email && invite.email !== session.user.email) {
      return NextResponse.json(
        { error: "This invite is for a different email address" },
        { status: 403 }
      );
    }

    // Zaten üye mi kontrol et
    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "You are already a member of this workspace" },
        { status: 400 }
      );
    }

    // Transaction ile üyelik oluştur ve daveti kullanıldı olarak işaretle
    await prisma.$transaction([
      prisma.workspaceMember.create({
        data: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
          role: invite.role,
        },
      }),
      prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: {
          usedAt: new Date(),
          usedBy: session.user.id,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "joined_workspace",
          entityType: "Workspace",
          entityId: invite.workspaceId,
          metadata: { role: invite.role },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      workspace: invite.workspace,
      role: invite.role,
    });
  } catch (error) {
    console.error("[INVITES] Error accepting invite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Daveti sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Kullanıcının admin olduğunu kontrol et
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
        },
      },
    });

    if (!membership || membership.role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete invites" }, { status: 403 });
    }

    await prisma.workspaceInvite.delete({
      where: { id: invite.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INVITES] Error deleting invite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

