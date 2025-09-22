
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Get image record from database
    const image = await prisma.image.findFirst({
      where: { filename }
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Read file from uploads directory
    const filePath = path.join(process.cwd(), "uploads", filename);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": image.mimeType,
          "Content-Length": image.size.toString(),
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (fileError) {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
