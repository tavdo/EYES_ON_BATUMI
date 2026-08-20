import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";
import { getPhotoById, isPhotoAccessible, PHOTO_SELECT, type Photo } from "./photos";
import { generateUniqueDeliveryCode, normalizePhotoCode } from "./telegram/codes";

export type Album = {
  id: string;
  title: string | null;
  created_at: number;
  expires_at: number | null;
  active: number;
  telegram_code: string | null;
};

export type AdminAlbum = Album & {
  photo_count: number;
};

type AlbumRow = Album & {
  photo_count?: number | string | null;
};

function mapAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    title: row.title,
    created_at: Number(row.created_at),
    expires_at: row.expires_at == null ? null : Number(row.expires_at),
    active: Number(row.active),
    telegram_code: row.telegram_code == null ? null : String(row.telegram_code),
  };
}

export function isAlbumAccessible(album: Album) {
  if (album.active !== 1) return false;
  if (album.expires_at != null && album.expires_at <= Date.now()) return false;
  return true;
}

export async function createAlbum(input: {
  photoIds: string[];
  title?: string | null;
  expiresAt?: number | null;
}) {
  await ensureSchema();
  const id = nanoid(16);
  const createdAt = Date.now();
  const telegramCode = await generateUniqueDeliveryCode();

  await getTurso().execute({
    sql: `INSERT INTO albums (id, title, created_at, expires_at, active, telegram_code)
          VALUES (?, ?, ?, ?, 1, ?)`,
    args: [id, input.title ?? null, createdAt, input.expiresAt ?? null, telegramCode],
  });

  for (let index = 0; index < input.photoIds.length; index += 1) {
    await getTurso().execute({
      sql: `INSERT INTO album_photos (album_id, photo_id, position) VALUES (?, ?, ?)`,
      args: [id, input.photoIds[index], index],
    });
  }

  return { id, telegramCode };
}

export async function getAlbumById(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "SELECT id, title, created_at, expires_at, active, telegram_code FROM albums WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as unknown as AlbumRow | undefined;
  return row ? mapAlbum(row) : null;
}

export async function getAlbumByTelegramCode(rawCode: string) {
  await ensureSchema();
  const code = normalizePhotoCode(rawCode);
  const result = await getTurso().execute({
    sql: "SELECT id, title, created_at, expires_at, active, telegram_code FROM albums WHERE telegram_code = ?",
    args: [code],
  });
  const row = result.rows[0] as unknown as AlbumRow | undefined;
  return row ? mapAlbum(row) : null;
}

export async function getAlbumPhotoIds(albumId: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `SELECT ${PHOTO_SELECT}
          FROM photos p
          INNER JOIN album_photos ap ON ap.photo_id = p.id
          WHERE ap.album_id = ?
          ORDER BY ap.position ASC`,
    args: [albumId],
  });

  return result.rows.map((row) => String(row.id));
}

export async function getAccessibleAlbumWithPhotos(id: string) {
  const album = await getAlbumById(id);
  if (!album || !isAlbumAccessible(album)) return null;

  const photoIds = await getAlbumPhotoIds(id);
  const photos: Photo[] = [];
  for (const photoId of photoIds) {
    const photo = await getPhotoById(photoId);
    if (photo && isPhotoAccessible(photo)) photos.push(photo);
  }

  if (photos.length === 0) return null;
  return { album, photos };
}

export async function getAccessibleAlbumByTelegramCode(rawCode: string) {
  const album = await getAlbumByTelegramCode(rawCode);
  if (!album || !isAlbumAccessible(album)) return null;
  return getAccessibleAlbumWithPhotos(album.id);
}

export async function listAlbumsForAdmin() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT id, title, created_at, expires_at, active, telegram_code FROM albums WHERE active = 1 ORDER BY created_at DESC`,
  );
  return (result.rows as unknown as AlbumRow[]).map(mapAlbum);
}

export async function listAlbumsForAdminDetailed(limit = 40) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `SELECT a.id, a.title, a.created_at, a.expires_at, a.active, a.telegram_code,
                 COUNT(ap.photo_id) AS photo_count
          FROM albums a
          LEFT JOIN album_photos ap ON ap.album_id = a.id
          WHERE a.active = 1
          GROUP BY a.id
          ORDER BY a.created_at DESC
          LIMIT ?`,
    args: [limit],
  });

  return (result.rows as unknown as AlbumRow[]).map((row) => ({
    ...mapAlbum(row),
    photo_count: Number(row.photo_count ?? 0),
  })) satisfies AdminAlbum[];
}

export async function deactivateAlbum(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE albums SET active = 0 WHERE id = ? AND active = 1",
    args: [id],
  });
  return result.rowsAffected > 0;
}
