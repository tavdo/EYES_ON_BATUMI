import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import QRCode from "qrcode";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontPath = join(root, "app/fonts/HokusaiPersonalUseRegular.ttf");
const outPng = join(root, "public/qr-eyes-on-batumi.png");
const url = "https://www.eyesonbatumi.ge";
const brand = "eyes.on.batumi";

const cream = "#F7F2EA";
const navy = "#16202A";
const terracotta = "#D97B4F";

const width = 1400;
const height = 1680;

function pathToSvg(path, fill) {
  return `<path d="${path.toPathData(2)}" fill="${fill}"/>`;
}

const font = opentype.parse(readFileSync(fontPath).buffer);
const wordPath = font.getPath(brand, 0, 0, 86);
const bbox = wordPath.getBoundingBox();
const wordW = bbox.x2 - bbox.x1;
const wordH = bbox.y2 - bbox.y1;
const wordOffsetX = -bbox.x1;
const wordOffsetY = -bbox.y1;

const tiles = [];
for (let row = 0; row < 16; row += 1) {
  for (let col = 0; col < 6; col += 1) {
    const x = -80 + col * (wordW + 48) + (row % 2 === 0 ? 0 : 90);
    const y = -40 + row * (wordH + 36);
    tiles.push(
      `<g transform="translate(${x + wordOffsetX} ${y + wordOffsetY}) rotate(-12)" opacity="0.14">${pathToSvg(wordPath, navy)}</g>`,
    );
  }
}

const titlePath = font.getPath(brand, 0, 0, 92);
const titleBox = titlePath.getBoundingBox();
const titleG = `<g transform="translate(${(width - (titleBox.x2 - titleBox.x1)) / 2 - titleBox.x1} ${1588 - titleBox.y1})">${pathToSvg(titlePath, navy)}</g>`;

const qrSize = 820;
const qrX = (width - qrSize) / 2;
const qrY = 210;
const qrPng = await QRCode.toBuffer(url, {
  type: "png",
  width: qrSize,
  margin: 2,
  errorCorrectionLevel: "H",
  color: { dark: navy, light: cream },
});

const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${cream}"/>
  <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="${navy}" stroke-width="2" rx="48"/>
  <rect x="52" y="52" width="${width - 104}" height="${height - 104}" fill="none" stroke="${terracotta}" stroke-width="3" rx="40"/>
  ${tiles.join("\n")}
  <rect x="${qrX - 28}" y="${qrY - 28}" width="${qrSize + 56}" height="${qrSize + 56}" rx="28" fill="${cream}" fill-opacity="0.72"/>
  ${titleG}
</svg>`);

const base = await sharp(card).png().toBuffer();
const framed = await sharp(base)
  .composite([
    {
      input: qrPng,
      left: Math.round(qrX),
      top: Math.round(qrY),
    },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(outPng, framed);
console.log(`wrote ${outPng}`);
