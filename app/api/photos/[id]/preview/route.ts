import { NextResponse } from "next/server";
import { getPhotoById, isPhotoAccessible } from "@/lib/photos";
import { openStoredFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const photo = await getPhotoById(id);

  if (!photo || !isPhotoAccessible(photo)) {
    return NextResponse.json(
      { error: "ეს ბმული არასწორია ან ვადაგასულია" },
      { status: 404 },
    );
  }

  try {
    const file = await openStoredFile(photo.thumb_path);
    const isJpeg =
      photo.thumb_path.includes("thumb.jpg") ||
      photo.thumb_path.endsWith(".jpg") ||
      photo.thumb_path.endsWith(".jpeg");

    const headers = new Headers({
      "Content-Type":
        file.contentType || (isJpeg ? "image/jpeg" : photo.mime_type || "image/jpeg"),
      "Cache-Control": "private, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
    });
    if (file.size != null) {
      headers.set("Content-Length", String(file.size));
    }

    return new NextResponse(file.stream, { headers });
  } catch {
    return NextResponse.json(
      { error: "ეს ბმული არასწორია ან ვადაგასულია" },
      { status: 404 },
    );
  }
}
