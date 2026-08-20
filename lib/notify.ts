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
  if (!telegramConfigured()) return false;

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

  return response.ok;
}

export async function notifyNewBooking(input: {
  name: string;
  phone: string;
  instagram: string | null;
  preferredDate: string;
  timeOfDay: string;
  message: string | null;
}) {
  const lines = [
    "📸 ახალი ჯავშანი — eyes.on.batumi",
    "",
    `სახელი: ${input.name}`,
    `ტელეფონი: ${input.phone}`,
    input.instagram ? `Instagram: @${input.instagram}` : null,
    `თარიღი: ${input.preferredDate}`,
    `დრო: ${TIME_LABEL[input.timeOfDay] ?? input.timeOfDay}`,
    input.message ? `შეტყობინება: ${input.message}` : null,
  ].filter(Boolean);

  await sendTelegram(lines.join("\n"));
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

  await sendTelegram(lines.join("\n"));
}

export { telegramConfigured };
