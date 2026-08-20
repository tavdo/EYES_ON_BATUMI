import { whatsappUrl } from "@/lib/contact";

const TIME_LABEL: Record<string, string> = {
  morning: "დილა",
  afternoon: "შუადღე",
  evening: "საღამო",
  flexible: "როგორც გამოვა",
};

function telegramConfigured() {
  const token = process.env.BOT_TOKEN?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || process.env.ADMIN_TELEGRAM_ID?.trim();
  return Boolean(token && chatId);
}

async function sendTelegram(text: string) {
  if (!telegramConfigured()) {
    console.error("telegram notify not configured (BOT_TOKEN / ADMIN_TELEGRAM_ID)");
    return false;
  }

  const token = process.env.BOT_TOKEN?.trim() || process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || process.env.ADMIN_TELEGRAM_ID!;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("telegram sendMessage failed", response.status, body);
    return false;
  }

  return true;
}

export async function notifyNewBooking(input: {
  name: string;
  phone: string;
  instagram: string | null;
  preferredDate: string;
  timeOfDay: string;
  message: string | null;
}) {
  const digits = input.phone.replace(/\D/g, "");
  const wa =
    digits.length >= 9
      ? whatsappUrl(digits.startsWith("995") ? digits : `995${digits.replace(/^0/, "")}`)
      : null;

  const lines = [
    "📸 ახალი ჯავშანი — eyes.on.batumi",
    "",
    `სახელი: ${input.name}`,
    `ტელეფონი: ${input.phone}`,
    input.instagram ? `Instagram: @${input.instagram}` : null,
    `თარიღი: ${input.preferredDate}`,
    `დრო: ${TIME_LABEL[input.timeOfDay] ?? input.timeOfDay}`,
    input.message ? `შეტყობინება: ${input.message}` : null,
    wa ? `WhatsApp: ${wa}` : null,
  ].filter(Boolean);

  return sendTelegram(lines.join("\n"));
}

export async function notifyWeeklySummary(input: {
  homeViews: number;
  bookings: number;
  downloads: number;
  photoViews: number;
  newBookings: number;
}) {
  const lines = [
    "📊 კვირის შეჯამება — eyes.on.batumi",
    "",
    `მთავარი გვერდი: ${input.homeViews}`,
    `ჯავშნები (სულ): ${input.bookings}`,
    `ახალი ჯავშნები: ${input.newBookings}`,
    `ფოტოს ნახვები: ${input.photoViews}`,
    `ჩამოტვირთვები: ${input.downloads}`,
  ];

  return sendTelegram(lines.join("\n"));
}

export { telegramConfigured };
