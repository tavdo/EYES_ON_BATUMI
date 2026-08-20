/**
 * Register Telegram webhook after deploy.
 * Usage: node scripts/set-telegram-webhook.js
 * Requires BOT_TOKEN or TELEGRAM_BOT_TOKEN and NEXT_PUBLIC_SITE_URL in env.
 */

const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token) {
  console.error("Missing BOT_TOKEN or TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

if (!site) {
  console.error("Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL");
  process.exit(1);
}

const webhookUrl = `${site.replace(/\/$/, "")}/api/telegram/webhook`;

async function main() {
  const body = {
    url: webhookUrl,
    allowed_updates: ["message"],
    ...(secret ? { secret_token: secret } : {}),
  };

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  if (!data.ok) process.exit(1);
}

main();
