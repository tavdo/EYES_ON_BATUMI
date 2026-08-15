import { createClient, type Client } from "@libsql/client";

const globalForTurso = globalThis as unknown as { turso?: Client };

function createTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }
  if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN is not set");
  }

  return createClient({ url, authToken });
}

export function getTurso() {
  if (!globalForTurso.turso) {
    globalForTurso.turso = createTurso();
  }
  return globalForTurso.turso;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getTurso()
      .batch(
        [
          `CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY,
            original_filename TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            original_path TEXT NOT NULL,
            thumb_path TEXT NOT NULL,
            caption TEXT,
            created_at INTEGER NOT NULL,
            expires_at INTEGER,
            active INTEGER NOT NULL DEFAULT 1,
            view_count INTEGER NOT NULL DEFAULT 0
          )`,
          `CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos (created_at DESC)`,
          `CREATE INDEX IF NOT EXISTS idx_photos_active ON photos (active)`,
        ],
        "write",
      )
      .then(() => undefined);
  }

  return schemaReady;
}
