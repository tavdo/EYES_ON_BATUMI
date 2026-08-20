import { Input } from "telegraf";
import type { Context } from "telegraf";
import type { Photo } from "@/lib/photos";
import { openStoredFile } from "@/lib/storage";
import { DELIVERY_CAPTION } from "./config";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

function safeFilename(name: string, fallback: string) {
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  return trimmed.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || fallback;
}

export async function sendStoredPhotoAsDocument(
  ctx: Context,
  photo: Photo,
  options?: { caption?: string },
) {
  if (!ctx.chat) return false;

  const file = await openStoredFile(photo.original_path);
  const buffer = await streamToBuffer(file.stream);
  const filename = safeFilename(photo.original_filename, `${photo.id}.jpg`);

  await ctx.telegram.sendDocument(
    ctx.chat.id,
    Input.fromBuffer(buffer, filename),
    options?.caption ? { caption: options.caption } : undefined,
  );
  return true;
}

export async function deliverAlbumPhotos(ctx: Context, photos: Photo[]) {
  if (!ctx.chat || photos.length === 0) return;

  await ctx.reply(`📸 ${photos.length} ფოტო მოდის...`);

  let sent = 0;
  for (const [index, photo] of photos.entries()) {
    try {
      await sendStoredPhotoAsDocument(ctx, photo, {
        caption: index === 0 ? DELIVERY_CAPTION : undefined,
      });
      sent += 1;
    } catch (error) {
      console.error("telegram album delivery failed", photo.id, error);
    }
    if (index < photos.length - 1) {
      await sleep(400);
    }
  }

  if (sent < photos.length) {
    await ctx.reply(`გაიგზავნა ${sent}/${photos.length} ფოტო. დანარჩენისთვის კიდევ გამოიყენე იგივე კოდი.`);
  }
}
