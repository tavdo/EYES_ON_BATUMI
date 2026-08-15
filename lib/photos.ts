import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";

export type Photo = {
  id: string;
  original_filename: string;
  mime_type: string;
  original_path: string;
  thumb_path: string;
  caption: string | null;
  created_at: number;
  expires_at: number | null;
  active: number;
  view_count: number;
};

type PhotoRow = {
  id: string;
  original_filename: string;
  mime_type: string;
  original_path: string;
  thumb_path: string;
  caption: string | null;
  created_at: number;
  expires_at: number | null;
  active: number;
  view_count: number;
};

function mapPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    original_filename: row.original_filename,
    mime_type: row.mime_type,
    original_path: row.original_path,
    thumb_path: row.thumb_path,
    caption: row.caption,
    created_at: Number(row.created_at),
    expires_at: row.expires_at == null ? null : Number(row.expires_at),
    active: Number(row.active),
    view_count: Number(row.view_count),
  };
}

export function createPhotoId() {
  return nanoid(21);
}

export function isPhotoAccessible(photo: Photo) {
  if (photo.active !== 1) return false;
  if (photo.expires_at != null && photo.expires_at <= Date.now()) return false;
  return true;
}

export async function getPhotoById(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `SELECT id, original_filename, mime_type, original_path, thumb_path,
                 caption, created_at, expires_at, active, view_count
          FROM photos WHERE id = ?`,
    args: [id],
  });

  const row = result.rows[0] as unknown as PhotoRow | undefined;
  return row ? mapPhoto(row) : null;
}

export async function listActivePhotos() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT id, original_filename, mime_type, original_path, thumb_path,
            caption, created_at, expires_at, active, view_count
     FROM photos
     WHERE active = 1
     ORDER BY created_at DESC`,
  );

  return (result.rows as unknown as PhotoRow[]).map(mapPhoto);
}

export async function insertPhoto(input: {
  id: string;
  originalFilename: string;
  mimeType: string;
  originalPath: string;
  thumbPath: string;
  caption: string | null;
  expiresAt: number | null;
}) {
  await ensureSchema();
  const createdAt = Date.now();

  await getTurso().execute({
    sql: `INSERT INTO photos (
            id, original_filename, mime_type, original_path, thumb_path,
            caption, created_at, expires_at, active, view_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
    args: [
      input.id,
      input.originalFilename,
      input.mimeType,
      input.originalPath,
      input.thumbPath,
      input.caption,
      createdAt,
      input.expiresAt,
    ],
  });

  return getPhotoById(input.id);
}

export async function incrementViewCount(id: string) {
  await ensureSchema();
  await getTurso().execute({
    sql: "UPDATE photos SET view_count = view_count + 1 WHERE id = ?",
    args: [id],
  });
}

export async function deactivatePhoto(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE photos SET active = 0 WHERE id = ? AND active = 1",
    args: [id],
  });
  return result.rowsAffected > 0;
}
