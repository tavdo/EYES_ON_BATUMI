import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { getPhotoById, isPhotoAccessible } from "@/lib/photos";
import { openStoredFile } from "@/lib/storage";

export const runtime = "nodejs";

function asciiFilename(name: string) {
  return name.replace(/[^\w.\-]+/g, "_") || "photo.jpg";
}

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
    const file = await openStoredFile(photo.original_path);
    void trackEvent("photo_download", photo.id);
    const encodedName = encodeURIComponent(photo.original_filename);
    const headers = new Headers({
      "Content-Type": file.contentType || photo.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asciiFilename(photo.original_filename)}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
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
