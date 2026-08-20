import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { notifyWeeklySummary, telegramConfigured } from "@/lib/notify";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!telegramConfigured()) {
    return NextResponse.json({ ok: true, skipped: "telegram not configured" });
  }

  const summary = await getAnalyticsSummary(7);
  await notifyWeeklySummary({
    homeViews: summary.homeViews,
    bookings: summary.totalBookings,
    downloads: summary.downloads,
    photoViews: summary.photoViews,
    newBookings: summary.newBookings,
  });

  return NextResponse.json({ ok: true, summary });
}
