import { ensureSchema, getTurso } from "@/lib/db";
import { generatePhotoCode, normalizePhotoCode } from "./codes";

export type TelegramPhoto = {
  code: string;
  file_id: string;
  created_at: number;
  added_by: number | null;
};

export async function saveTelegramPhoto(input: {
  fileId: string;
  addedBy: number;
}) {
  await ensureSchema();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generatePhotoCode();
    try {
      await getTurso().execute({
        sql: `INSERT INTO telegram_photos (code, file_id, created_at, added_by)
              VALUES (?, ?, ?, ?)`,
        args: [code, input.fileId, Date.now(), input.addedBy],
      });
      return code;
    } catch {
      // code collision — retry
    }
  }

  throw new Error("Could not generate unique photo code");
}

export async function getTelegramPhotoByCode(rawCode: string) {
  await ensureSchema();
  const code = normalizePhotoCode(rawCode);
  const result = await getTurso().execute({
    sql: "SELECT code, file_id, created_at, added_by FROM telegram_photos WHERE code = ?",
    args: [code],
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    code: String(row.code),
    file_id: String(row.file_id),
    created_at: Number(row.created_at),
    added_by: row.added_by == null ? null : Number(row.added_by),
  } satisfies TelegramPhoto;
}
