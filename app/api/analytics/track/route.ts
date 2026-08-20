import { NextResponse } from "next/server";
import { isAnalyticsEvent, trackEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  let event = "";
  let targetId: string | null = null;

  try {
    const body = (await request.json()) as { event?: string; targetId?: string };
    event = typeof body.event === "string" ? body.event : "";
    targetId =
      typeof body.targetId === "string" && body.targetId.trim()
        ? body.targetId.trim().slice(0, 64)
        : null;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!isAnalyticsEvent(event)) {
    return NextResponse.json({ error: "unknown event" }, { status: 400 });
  }

  try {
    await trackEvent(event, targetId);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
