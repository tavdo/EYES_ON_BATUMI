import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPhotoById, insertPhoto } from "@/lib/photos";
import {
  ALLOWED_IMAGE_TYPES,
  isVercelBlobUrl,
  PHOTO_ID_PATTERN,
} from "@/lib/storage";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  let body: {
    id?: string;
    originalUrl?: string;
    thumbUrl?: string;
    originalFilename?: string;
    mimeType?: string;
    caption?: string | null;
    expire?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const originalUrl = typeof body.originalUrl === "string" ? body.originalUrl : "";
  const thumbUrl = typeof body.thumbUrl === "string" ? body.thumbUrl : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "";
  const originalFilename =
    typeof body.originalFilename === "string" && body.originalFilename.trim()
      ? body.originalFilename.trim().slice(0, 180)
      : "photo.jpg";

  if (!PHOTO_ID_PATTERN.test(id) || !isVercelBlobUrl(originalUrl) || !isVercelBlobUrl(thumbUrl)) {
    return NextResponse.json({ error: "არასწორი ფაილი" }, { status: 400 });
  }

  if (!originalUrl.includes(`/photos/${id}/`) || !thumbUrl.includes(`/photos/${id}/`)) {
    return NextResponse.json({ error: "არასწორი ფაილი" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "დასაშვებია მხოლოდ JPEG, PNG, WebP ან HEIC" },
      { status: 400 },
    );
  }

  const existing = await getPhotoById(id);
  if (existing) {
    return NextResponse.json({ error: "ეს ბმული უკვე არსებობს" }, { status: 409 });
  }

  const caption =
    typeof body.caption === "string" && body.caption.trim()
      ? body.caption.trim().slice(0, 280)
      : null;

  const photo = await insertPhoto({
    id,
    originalFilename,
    mimeType,
    originalPath: originalUrl,
    thumbPath: thumbUrl,
    caption,
    expiresAt: body.expire === false ? null : Date.now() + THIRTY_DAYS_MS,
  });

  return NextResponse.json({ photo });
}
