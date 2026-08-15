# eyes.on.batumi

Private photo-delivery site for street portraits shot in Batumi. Each photo gets an unlisted link the person can open on their phone to view and download the original file.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in:

   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`

2. Install and run:

```bash
npm install
npm run dev
```

3. Open [http://localhost:3000/admin](http://localhost:3000/admin), sign in, and upload photos. Copy each generated `/p/...` link.

The photos table is created automatically in Turso on first use. Locally, originals are stored under `data/uploads/`.

## Deploy on Vercel

1. Import this GitHub repo in Vercel.
2. Add these environment variables:

   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`

3. After the first deploy, open the Vercel project → **Storage** → **Create Database** → **Blob**. Choose **Private**, connect it to this project (Production + Preview).
4. Redeploy so `BLOB_READ_WRITE_TOKEN` is available. Uploads then go directly to Blob (needed because Vercel functions cannot receive files larger than 4.5MB).

Visitor pages stay at `/p/{id}` and are `noindex`. Deleting a photo in admin deactivates the link and removes the files.
