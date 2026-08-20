import { NextResponse } from "next/server";
import { deactivatePhoto, getPhotoById, setPhotoPublic, updatePhotoSettings } from "@/lib/photos";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteStoredFiles } from "@/lib/storage";
import type { Season } from "@/lib/site-content";

const SEASONS = new Set(["summer", "autumn", "winter", "spring"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: {
    isPublic?: boolean;
    watermark?: boolean;
    isFeatured?: boolean;
    season?: string | null;
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  const season =
    body.season === null
      ? null
      : typeof body.season === "string" && SEASONS.has(body.season)
        ? (body.season as Season)
        : undefined;

  const updated = await updatePhotoSettings(id, {
    isPublic: body.isPublic,
    watermark: body.watermark,
    isFeatured: body.isFeatured,
    season,
  });

  if (!updated && body.isPublic !== undefined) {
    const fallback = await setPhotoPublic(id, body.isPublic === true);
    if (!fallback) {
      return NextResponse.json({ error: "ფოტო ვერ მოიძებნა" }, { status: 404 });
    }
  } else if (!updated) {
    return NextResponse.json({ error: "ფოტო ვერ მოიძებნა" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  const { id } = await context.params;
  const photo = await getPhotoById(id);
  if (!photo || photo.active !== 1) {
    return NextResponse.json({ error: "ფოტო ვერ მოიძებნა" }, { status: 404 });
  }

  await deactivatePhoto(id);
  await deleteStoredFiles([photo.original_path, photo.thumb_path]);

  return NextResponse.json({ ok: true });
}
