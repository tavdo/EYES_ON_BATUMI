import { NextResponse } from "next/server";
import { getPhotoById, isPhotoAccessible } from "@/lib/photos";
import { openStoredFile } from "@/lib/storage";
import { applyWatermark } from "@/lib/watermark";

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

    let body: BodyInit = file.stream;
    let contentType =
      file.contentType || (isJpeg ? "image/jpeg" : photo.mime_type || "image/jpeg");
    let size = file.size;

    if (photo.watermark === 1) {
      const raw = Buffer.from(await new Response(file.stream).arrayBuffer());
      const watermarked = await applyWatermark(raw);
      body = watermarked;
      contentType = "image/jpeg";
      size = watermarked.length;
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control":
        photo.watermark === 1
          ? "private, no-cache, must-revalidate"
          : "private, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
    });
    if (size != null) headers.set("Content-Length", String(size));

    return new NextResponse(body, { headers });
  } catch {
    return NextResponse.json(
      { error: "ეს ბმული არასწორია ან ვადაგასულია" },
      { status: 404 },
    );
  }
}
