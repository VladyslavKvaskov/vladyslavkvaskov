import { NextResponse } from "next/server";

const CACHE_TIME = 60 * 60 * 24 * 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: fileId } = await params;
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const response = await fetch(url, {
    next: { revalidate: CACHE_TIME },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Google Drive" },
      { status: response.status },
    );
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${CACHE_TIME}, s-maxage=${CACHE_TIME}`,
      "CDN-Cache-Control": `public, max-age=${CACHE_TIME}, immutable`,
    },
  });
}
