import sharp from "sharp";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sparse, dual-tone brand mark on previews only. */
export async function applyWatermark(buffer: Buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const width = meta.width ?? 1200;
  const height = meta.height ?? 1500;
  const shortest = Math.min(width, height);

  const fontSize = Math.max(18, Math.round(shortest * 0.034));
  const stepX = Math.round(fontSize * 16);
  const stepY = Math.round(fontSize * 9);
  const label = escapeXml("eyes.on.batumi");
  const cover = Math.ceil(Math.hypot(width, height));
  const cx = cover / 2;
  const cy = cover / 2;

  const texts: string[] = [];
  let row = 0;
  for (let y = fontSize; y < cover; y += stepY) {
    const rowOffset = row % 2 === 0 ? 0 : stepX / 2;
    row += 1;
    for (let x = 0; x < cover; x += stepX) {
      texts.push(
        `<text x="${x + rowOffset}" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" letter-spacing="1.6" fill="none" stroke="rgba(22,32,42,0.22)" stroke-width="${Math.max(1, fontSize * 0.06)}">${label}</text>`,
        `<text x="${x + rowOffset}" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" letter-spacing="1.6" fill="rgba(247,242,234,0.28)">${label}</text>`,
      );
    }
  }

  const cornerSize = Math.max(13, Math.round(shortest * 0.022));
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${width / 2} ${height / 2}) rotate(-32) translate(${-cx} ${-cy})" opacity="0.85">
    ${texts.join("\n    ")}
  </g>
  <text x="${width - 28}" y="${height - 28}" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="${cornerSize}" letter-spacing="1.4" fill="rgba(247,242,234,0.9)" stroke="rgba(22,32,42,0.45)" stroke-width="2.2" paint-order="stroke fill">${label}</text>
</svg>`;

  return image
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 86, progressive: true })
    .toBuffer();
}
