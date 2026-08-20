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

async function migrate() {
  const db = getTurso();

  await db.batch(
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
  );

  const info = await db.execute("PRAGMA table_info(photos)");
  const columns = new Set(info.rows.map((row) => String(row.name)));

  if (!columns.has("is_public")) {
    await db.execute(
      "ALTER TABLE photos ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0",
    );
  }

  await db.execute(
    "CREATE INDEX IF NOT EXISTS idx_photos_public ON photos (is_public, active)",
  );

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        instagram TEXT,
        preferred_date TEXT NOT NULL,
        time_of_day TEXT NOT NULL,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status)`,
    ],
    "write",
  );

  const photoInfo = await db.execute("PRAGMA table_info(photos)");
  const photoColumns = new Set(photoInfo.rows.map((row) => String(row.name)));

  if (!photoColumns.has("watermark")) {
    await db.execute(
      "ALTER TABLE photos ADD COLUMN watermark INTEGER NOT NULL DEFAULT 0",
    );
  }
  if (!photoColumns.has("season")) {
    await db.execute("ALTER TABLE photos ADD COLUMN season TEXT");
  }
  if (!photoColumns.has("is_featured")) {
    await db.execute(
      "ALTER TABLE photos ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0",
    );
  }

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS albums (
        id TEXT PRIMARY KEY,
        title TEXT,
        created_at INTEGER NOT NULL,
        expires_at INTEGER,
        active INTEGER NOT NULL DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS album_photos (
        album_id TEXT NOT NULL,
        photo_id TEXT NOT NULL,
        position INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (album_id, photo_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums (created_at DESC)`,
      `CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        target_id TEXT,
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type)`,
      `CREATE TABLE IF NOT EXISTS telegram_photos (
        code TEXT PRIMARY KEY,
        file_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        added_by INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS telegram_bookings (
        id TEXT PRIMARY KEY,
        telegram_user_id INTEGER NOT NULL,
        telegram_username TEXT,
        preferred_date TEXT NOT NULL,
        location TEXT NOT NULL,
        session_type TEXT NOT NULL,
        contact TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_tg_bookings_status ON telegram_bookings (status, created_at DESC)`,
      `CREATE TABLE IF NOT EXISTS telegram_sessions (
        chat_id INTEGER PRIMARY KEY,
        flow TEXT NOT NULL,
        step INTEGER NOT NULL,
        data TEXT,
        updated_at INTEGER NOT NULL
      )`,
    ],
    "write",
  );

  const albumInfo = await db.execute("PRAGMA table_info(albums)");
  const albumColumns = new Set(albumInfo.rows.map((row) => String(row.name)));

  if (!albumColumns.has("telegram_code")) {
    await db.execute("ALTER TABLE albums ADD COLUMN telegram_code TEXT");
  }
  await db.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_albums_telegram_code ON albums (telegram_code) WHERE telegram_code IS NOT NULL",
  );
}

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = migrate().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  return schemaReady;
}
