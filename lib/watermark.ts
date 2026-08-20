import sharp from "sharp";

export async function applyWatermark(buffer: Buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const width = meta.width ?? 1200;
  const fontSize = Math.max(18, Math.round(width * 0.035));

  const svg = `<svg width="${width}" height="${Math.round(width * 0.08)}">
    <text x="50%" y="55%" text-anchor="middle" font-family="Arial,sans-serif" font-size="${fontSize}" fill="rgba(244,237,226,0.55)">eyes.on.batumi</text>
  </svg>`;

  return image
    .composite([{ input: Buffer.from(svg), gravity: "southeast" }])
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();
}
