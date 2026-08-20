import sharp from "sharp";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Full-frame diagonal tile: "EYES ON BATUMI" over the photo (preview only). */
export async function applyWatermark(buffer: Buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const width = meta.width ?? 1200;
  const height = meta.height ?? 1500;

  const fontSize = Math.max(14, Math.round(Math.min(width, height) * 0.038));
  const stepX = Math.round(fontSize * 9.2);
  const stepY = Math.round(fontSize * 2.8);
  const label = escapeXml("EYES ON BATUMI");

  // Oversized canvas so rotation still covers every corner.
  const cover = Math.ceil(Math.hypot(width, height) * 1.15);
  const cx = cover / 2;
  const cy = cover / 2;

  const texts: string[] = [];
  for (let y = -cover; y < cover * 2; y += stepY) {
    const rowOffset = Math.floor(y / stepY) % 2 === 0 ? 0 : stepX / 2;
    for (let x = -cover; x < cover * 2; x += stepX) {
      texts.push(
        `<text x="${x + rowOffset}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="500" fill="rgba(244,237,226,0.28)">${label}</text>`,
      );
    }
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${width / 2} ${height / 2}) rotate(-35) translate(${-cx} ${-cy})">
    ${texts.join("\n    ")}
  </g>
</svg>`;

  return image
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();
}
