import { NextResponse } from "next/server";
import { createAlbum, listAlbumsForAdminDetailed } from "@/lib/albums";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPhotoById } from "@/lib/photos";
import { botUsername } from "@/lib/telegram/config";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_ALBUM_PHOTOS = 50;

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  const albums = await listAlbumsForAdminDetailed();
  return NextResponse.json({ albums });
}

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
      ? body.photoIds.filter((id) => typeof id === "string").slice(0, MAX_ALBUM_PHOTOS)
      : [];
    title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim().slice(0, 120)
        : null;
    expire = body.expire !== false;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  if (photoIds.length < 1) {
    return NextResponse.json({ error: "მინიმუმ 1 ფოტო სჭირდება" }, { status: 400 });
  }

  for (const id of photoIds) {
    const photo = await getPhotoById(id);
    if (!photo || photo.active !== 1) {
      return NextResponse.json({ error: "ფოტო ვერ მოიძებნა" }, { status: 400 });
    }
  }

  const { id: albumId, telegramCode } = await createAlbum({
    photoIds,
    title,
    expiresAt: expire ? Date.now() + THIRTY_DAYS_MS : null,
  });

  const username = botUsername().replace(/^@/, "") || "EYESONBATUMIbot";

  return NextResponse.json({
    albumId,
    telegramCode,
    photoCount: photoIds.length,
    telegramLink: `https://t.me/${username}?start=${telegramCode}`,
  });
}
