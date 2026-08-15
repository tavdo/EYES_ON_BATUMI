import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deactivatePhoto, getPhotoById } from "@/lib/photos";
import { deleteStoredFiles } from "@/lib/storage";

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
