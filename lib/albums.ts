import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";
import { getPhotoById, isPhotoAccessible, PHOTO_SELECT, type Photo } from "./photos";

export type Album = {
  id: string;
  title: string | null;
  created_at: number;
  expires_at: number | null;
  active: number;
};

type AlbumRow = Album;

function mapAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    title: row.title,
    created_at: Number(row.created_at),
    expires_at: row.expires_at == null ? null : Number(row.expires_at),
    active: Number(row.active),
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

  await getTurso().execute({
    sql: `INSERT INTO albums (id, title, created_at, expires_at, active)
          VALUES (?, ?, ?, ?, 1)`,
    args: [id, input.title ?? null, createdAt, input.expiresAt ?? null],
  });

  for (let index = 0; index < input.photoIds.length; index += 1) {
    await getTurso().execute({
      sql: `INSERT INTO album_photos (album_id, photo_id, position) VALUES (?, ?, ?)`,
      args: [id, input.photoIds[index], index],
    });
  }

  return id;
}

export async function getAlbumById(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "SELECT id, title, created_at, expires_at, active FROM albums WHERE id = ?",
    args: [id],
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

export async function listAlbumsForAdmin() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT id, title, created_at, expires_at, active FROM albums WHERE active = 1 ORDER BY created_at DESC`,
  );
  return (result.rows as unknown as AlbumRow[]).map(mapAlbum);
}

export async function deactivateAlbum(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE albums SET active = 0 WHERE id = ? AND active = 1",
    args: [id],
  });
  return result.rowsAffected > 0;
}
