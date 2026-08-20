import { NextResponse } from "next/server";
import { ensureSchema } from "@/lib/db";
import { getTelegramBot } from "@/lib/telegram/bot";
import { botToken, isBotConfigured, webhookSecret } from "@/lib/telegram/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!isBotConfigured()) {
    return NextResponse.json({ error: "bot not configured" }, { status: 503 });
  }

  const secret = webhookSecret();
  if (secret) {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    await ensureSchema();
    const update = await request.json();
    await getTelegramBot().handleUpdate(update);
  } catch (error) {
    console.error("telegram webhook error", error);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: isBotConfigured(),
    tokenSet: Boolean(botToken()),
  });
}
