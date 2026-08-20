export function botToken() {
  return process.env.BOT_TOKEN?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

export function adminTelegramId() {
  return process.env.ADMIN_TELEGRAM_ID?.trim() || "";
}

export function botUsername() {
  return process.env.TELEGRAM_BOT_USERNAME?.trim() || "";
}

export function webhookSecret() {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || "";
}

export function isBotConfigured() {
  return Boolean(botToken());
}

export function isAdmin(userId: number | undefined) {
  if (!userId) return false;
  const adminId = adminTelegramId();
  if (!adminId) return false;
  return String(userId) === adminId;
}

export const DELIVERY_CAPTION =
  "აი შენი ფოტო ბათუმის ქუჩებიდან 📸 თუ გააზიარებ, მონიშნე @eyes.on.batumi 🙏";

export const INVALID_CODE_MESSAGE =
  "ეს კოდი ვერ მოიძებნა 😕 გადაამოწმე ბმული ან მომწერე პირდაპირ.";

export const BOOKING_BUTTON = "📅 ფოტოსესიის დაჯავშნა";
