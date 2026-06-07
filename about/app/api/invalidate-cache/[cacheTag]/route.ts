import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ cacheTag: string }> },
) => {
  try {
    const { cacheTag } = await params;

    revalidateTag(cacheTag, "max");

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag: cacheTag,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 },
    );
  }
};
