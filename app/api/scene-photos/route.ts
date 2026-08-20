import { NextResponse } from "next/server";
import { listPublicPhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const photos = await listPublicPhotos();
    const urls = photos.slice(0, 24).map((photo) => `/api/photos/${photo.id}/preview`);
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: [] });
  }
}
