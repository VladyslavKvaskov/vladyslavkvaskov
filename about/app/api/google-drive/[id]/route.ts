import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: fileId } = await params;
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Google Drive" },
      { status: response.status },
    );
  }

  const data = await response.blob();

  return new NextResponse(data);
}
