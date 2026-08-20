import { NextResponse } from "next/server";
import { createAlbum } from "@/lib/albums";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPhotoById } from "@/lib/photos";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  let photoIds: string[] = [];
  let title: string | null = null;
  let expire = true;

  try {
    const body = (await request.json()) as {
      photoIds?: string[];
      title?: string;
      expire?: boolean;
    };
    photoIds = Array.isArray(body.photoIds)
      ? body.photoIds.filter((id) => typeof id === "string").slice(0, 30)
      : [];
    title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim().slice(0, 120)
        : null;
    expire = body.expire !== false;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  if (photoIds.length < 2) {
    return NextResponse.json({ error: "მინიმუმ 2 ფოტო სჭირდება" }, { status: 400 });
  }

  for (const id of photoIds) {
    const photo = await getPhotoById(id);
    if (!photo || photo.active !== 1) {
      return NextResponse.json({ error: "ფოტო ვერ მოიძებნა" }, { status: 400 });
    }
  }

  const albumId = await createAlbum({
    photoIds,
    title,
    expiresAt: expire ? Date.now() + THIRTY_DAYS_MS : null,
  });

  return NextResponse.json({ albumId });
}
