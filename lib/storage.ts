import { mkdir, unlink, writeFile } from "fs/promises";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { del, get, put } from "@vercel/blob";
import sharp from "sharp";
import { blobAuth, isBlobStorageEnabled } from "./blob-env";

const UPLOAD_ROOT = path.join(process.cwd(), "data", "uploads");

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export const ALLOWED_IMAGE_TYPES = new Set(Object.keys(MIME_TO_EXT));
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const PHOTO_ID_PATTERN = /^[A-Za-z0-9_-]{21}$/;

export function extensionForMime(mimeType: string) {
  return MIME_TO_EXT[mimeType] ?? "bin";
}

export function isRemoteStoredPath(storedPath: string) {
  return storedPath.startsWith("https://") || storedPath.startsWith("http://");
}

export function isVercelBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export { isBlobStorageEnabled } from "./blob-env";

export function toAbsolutePath(relativePath: string) {
  const parts = relativePath.split("/").filter((part) => part && part !== "..");
  return path.join(UPLOAD_ROOT, ...parts);
}

async function makeThumbBuffer(buffer: Buffer) {
  try {
    return await sharp(buffer)
      .rotate()
      .resize(1400, 1400, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toBuffer();
  } catch {
    return null;
  }
}

export async function saveOriginalAndThumb(id: string, file: File) {
  const mimeType = file.type || "application/octet-stream";
  const ext = extensionForMime(mimeType);
  const buffer = Buffer.from(await file.arrayBuffer());
  const thumbBuffer = await makeThumbBuffer(buffer);

  if (isBlobStorageEnabled()) {
    const original = await put(`photos/${id}/original.${ext}`, buffer, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: mimeType,
      ...blobAuth(),
    });
    const thumb = await put(`photos/${id}/thumb.jpg`, thumbBuffer ?? buffer, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: thumbBuffer ? "image/jpeg" : mimeType,
      ...blobAuth(),
    });

    return {
      originalPath: original.url,
      thumbPath: thumb.url,
      mimeType,
    };
  }

  const originalRel = `${id}/original.${ext}`;
  const thumbRel = `${id}/thumb.jpg`;

  await mkdir(path.join(UPLOAD_ROOT, id), { recursive: true });
  await writeFile(toAbsolutePath(originalRel), buffer);

  let thumbPath = thumbRel;
  if (thumbBuffer) {
    await writeFile(toAbsolutePath(thumbRel), thumbBuffer);
  } else {
    thumbPath = originalRel;
  }

  return {
    originalPath: originalRel,
    thumbPath,
    mimeType,
  };
}

export async function openStoredFile(storedPath: string) {
  if (isRemoteStoredPath(storedPath)) {
    const result = await get(storedPath, { access: "private", ...blobAuth() });
    if (!result || result.statusCode !== 200) {
      throw new Error("missing");
    }

    return {
      stream: result.stream,
      contentType: result.blob.contentType,
      size: result.blob.size,
    };
  }

  const filePath = toAbsolutePath(storedPath);
  const fileStat = await stat(filePath);
  const nodeStream = createReadStream(filePath);

  return {
    stream: Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>,
    contentType: null as string | null,
    size: fileStat.size,
  };
}

export async function deleteStoredFiles(paths: string[]) {
  const remote = [...new Set(paths.filter(isRemoteStoredPath))];
  const local = paths.filter((item) => !isRemoteStoredPath(item));

  if (remote.length > 0) {
    try {
      await del(remote, blobAuth());
    } catch {
      // Link is still deactivated even if blob cleanup fails.
    }
  }

  await Promise.all(
    local.map(async (relativePath) => {
      try {
        await unlink(toAbsolutePath(relativePath));
      } catch {
        // File may already be gone.
      }
    }),
  );
}
