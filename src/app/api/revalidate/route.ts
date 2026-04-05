import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Verify revalidation secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path, tag, type } = body;

    if (tag) {
      // Revalidate by cache tag (Next.js 15+ requires profile param)
      revalidateTag(tag, "default");
      return NextResponse.json({
        success: true,
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    if (path) {
      // Revalidate by path
      revalidatePath(path, type === "layout" ? "layout" : "page");
      return NextResponse.json({
        success: true,
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Provide either 'path' or 'tag' to revalidate" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
