const fs = require("fs");
const { createClient } = require("@libsql/client");

for (const line of fs.readFileSync(".env.local", "utf8").split(/\n/)) {
  const match = line.match(/^([^#=\s]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.batch(
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

  const result = await client.execute("SELECT COUNT(*) AS n FROM photos");
  console.log("Turso ready, photos:", result.rows[0].n);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
