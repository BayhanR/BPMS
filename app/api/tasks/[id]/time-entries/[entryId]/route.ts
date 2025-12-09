import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endTime, description } = body;

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: params.entryId },
    });

    if (!timeEntry) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    if (timeEntry.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.timeEntry.update({
      where: { id: params.entryId },
      data: {
        endTime: endTime ? new Date(endTime) : null,
        description,
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
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[TIME_ENTRIES] Error updating time entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: params.entryId },
    });

    if (!timeEntry) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    if (timeEntry.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.timeEntry.delete({
      where: { id: params.entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TIME_ENTRIES] Error deleting time entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

