import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 8);

export function generatePhotoCode() {
  return nano();
}

export function isPhotoCode(value: string) {
  return /^[A-HJ-NP-Z2-9]{8}$/i.test(value.trim());
}

export function normalizePhotoCode(value: string) {
  return value.trim().toUpperCase();
}

export async function generateUniqueDeliveryCode() {
  const { getTurso, ensureSchema } = await import("@/lib/db");
  await ensureSchema();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generatePhotoCode();
    const result = await getTurso().execute({
      sql: `SELECT 1 AS hit FROM telegram_photos WHERE code = ?
            UNION
            SELECT 1 FROM albums WHERE telegram_code = ?`,
      args: [code, code],
    });
    if (result.rows.length === 0) return code;
  }

  throw new Error("Could not generate unique delivery code");
}
