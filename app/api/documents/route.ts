
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all public documents and user's private documents
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdById: user.id }
        ]
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        lastEditedBy: {
          select: { name: true, email: true }
        },
        images: true
      },
      orderBy: { lastEditedAt: 'desc' }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, isPublic } = body;

    const document = await prisma.document.create({
      data: {
        title: title || "Untitled Document",
        content: content || "",
        isPublic: Boolean(isPublic),
        createdById: user.id,
        lastEditedById: user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        lastEditedBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
