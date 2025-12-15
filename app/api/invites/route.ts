import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Davet oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, email, role = "editor" } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    // Kullanıcının admin olduğunu kontrol et
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership || membership.role !== "admin") {
      return NextResponse.json({ error: "Only admins can create invites" }, { status: 403 });
    }

    // Benzersiz token oluştur
    const token = crypto.randomBytes(32).toString("hex");

    // 7 gün geçerli davet
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.workspaceInvite.create({
      data: {
        workspaceId,
        email: email || null,
        token,
        role,
        expiresAt,
        createdBy: session.user.id,
      },
      include: {
        workspace: {
          select: { name: true },
        },
      },
    });

    // Davet linkini oluştur - client-side'da oluşturulacak, sadece token döndür
    // baseUrl client-side'da window.location.origin ile oluşturulacak

    return NextResponse.json({
      id: invite.id,
      token: invite.token,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      workspace: invite.workspace,
    }, { status: 201 });
  } catch (error) {
    console.error("[INVITES] Error creating invite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Workspace'in davetlerini listele
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    // Kullanıcının admin olduğunu kontrol et
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!membership || membership.role !== "admin") {
      return NextResponse.json({ error: "Only admins can view invites" }, { status: 403 });
    }

    const invites = await prisma.workspaceInvite.findMany({
      where: {
        workspaceId,
        usedAt: null, // Sadece kullanılmamış davetler
        expiresAt: { gt: new Date() }, // Süresi dolmamış
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("[INVITES] Error fetching invites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

