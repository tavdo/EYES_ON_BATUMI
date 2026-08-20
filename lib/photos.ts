import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";
import type { Season } from "./site-content";

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
  is_public: number;
  watermark: number;
  season: string | null;
  is_featured: number;
};

type PhotoRow = Photo;

export const PHOTO_SELECT = `p.id, p.original_filename, p.mime_type, p.original_path, p.thumb_path,
  p.caption, p.created_at, p.expires_at, p.active, p.view_count, p.is_public,
  p.watermark, p.season, p.is_featured`;

const PHOTO_COLUMNS = PHOTO_SELECT.replaceAll("p.", "");

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
    is_public: Number(row.is_public ?? 0),
    watermark: Number(row.watermark ?? 0),
    season: row.season ?? null,
    is_featured: Number(row.is_featured ?? 0),
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
    sql: `SELECT ${PHOTO_COLUMNS} FROM photos WHERE id = ?`,
    args: [id],
  });

  const row = result.rows[0] as unknown as PhotoRow | undefined;
  return row ? mapPhoto(row) : null;
}

export async function listActivePhotos() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT ${PHOTO_COLUMNS} FROM photos WHERE active = 1 ORDER BY created_at DESC`,
  );

  return (result.rows as unknown as PhotoRow[]).map(mapPhoto);
}

export async function listPublicPhotos(season?: Season | null) {
  await ensureSchema();
  const now = Date.now();
  const args: (string | number)[] = [now];
  let seasonSql = "";
  if (season) {
    seasonSql = " AND season = ?";
    args.push(season);
  }

  const result = await getTurso().execute({
    sql: `SELECT ${PHOTO_COLUMNS}
          FROM photos
          WHERE active = 1
            AND is_public = 1
            AND (expires_at IS NULL OR expires_at > ?)${seasonSql}
          ORDER BY created_at DESC`,
    args,
  });

  return (result.rows as unknown as PhotoRow[]).map(mapPhoto);
}

export async function listSeasonPhotos(season: Season) {
  await ensureSchema();
  const now = Date.now();
  const result = await getTurso().execute({
    sql: `SELECT ${PHOTO_COLUMNS}
          FROM photos
          WHERE active = 1
            AND is_public = 1
            AND (expires_at IS NULL OR expires_at > ?)
            AND (season = ? OR is_featured = 1)
          ORDER BY is_featured DESC, created_at DESC
          LIMIT 6`,
    args: [now, season],
  });

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
  isPublic?: boolean;
  watermark?: boolean;
  season?: Season | null;
}) {
  await ensureSchema();
  const createdAt = Date.now();

  await getTurso().execute({
    sql: `INSERT INTO photos (
            id, original_filename, mime_type, original_path, thumb_path,
            caption, created_at, expires_at, active, view_count, is_public,
            watermark, season, is_featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?, ?, 0)`,
    args: [
      input.id,
      input.originalFilename,
      input.mimeType,
      input.originalPath,
      input.thumbPath,
      input.caption,
      createdAt,
      input.expiresAt,
      input.isPublic ? 1 : 0,
      input.watermark ? 1 : 0,
      input.season ?? null,
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

export async function setPhotoPublic(id: string, isPublic: boolean) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE photos SET is_public = ? WHERE id = ? AND active = 1",
    args: [isPublic ? 1 : 0, id],
  });
  return result.rowsAffected > 0;
}

export async function updatePhotoSettings(
  id: string,
  input: {
    isPublic?: boolean;
    watermark?: boolean;
    season?: Season | null;
    isFeatured?: boolean;
  },
) {
  await ensureSchema();
  const sets: string[] = [];
  const args: (string | number | null)[] = [];

  if (input.isPublic !== undefined) {
    sets.push("is_public = ?");
    args.push(input.isPublic ? 1 : 0);
  }
  if (input.watermark !== undefined) {
    sets.push("watermark = ?");
    args.push(input.watermark ? 1 : 0);
  }
  if (input.season !== undefined) {
    sets.push("season = ?");
    args.push(input.season);
  }
  if (input.isFeatured !== undefined) {
    sets.push("is_featured = ?");
    args.push(input.isFeatured ? 1 : 0);
  }

  if (sets.length === 0) return false;

  args.push(id);
  const result = await getTurso().execute({
    sql: `UPDATE photos SET ${sets.join(", ")} WHERE id = ? AND active = 1`,
    args,
  });
  return result.rowsAffected > 0;
}

export async function deactivatePhoto(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE photos SET active = 0, is_public = 0, is_featured = 0 WHERE id = ? AND active = 1",
    args: [id],
  });
  return result.rowsAffected > 0;
}
