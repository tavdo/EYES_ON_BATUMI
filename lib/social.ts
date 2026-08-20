export const INSTAGRAM_URL = "https://www.instagram.com/eyes_on_batumi/";
export const TIKTOK_URL = "https://www.tiktok.com/@eyes_on_batumi";
export const SOCIAL_HANDLE = "@eyes_on_batumi";

const TELEGRAM_BOT =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, "") ||
  process.env.TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, "") ||
  "EYESONBATUMIbot";

export const TELEGRAM_BOT_USERNAME = TELEGRAM_BOT;
export const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT}`;
