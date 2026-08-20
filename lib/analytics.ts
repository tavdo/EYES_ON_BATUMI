import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";

export const ANALYTICS_EVENTS = [
  "home_view",
  "booking_submit",
  "photo_download",
  "album_view",
  "gallery_open",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export function isAnalyticsEvent(value: string): value is AnalyticsEvent {
  return (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

export async function trackEvent(event: AnalyticsEvent, targetId: string | null = null) {
  await ensureSchema();
  await getTurso().execute({
    sql: "INSERT INTO analytics_events (id, event_type, target_id, created_at) VALUES (?, ?, ?, ?)",
    args: [nanoid(12), event, targetId, Date.now()],
  });
}

export async function getAnalyticsSummary(days = 7) {
  await ensureSchema();
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  const events = await getTurso().execute({
    sql: `SELECT event_type, COUNT(*) AS count
          FROM analytics_events
          WHERE created_at >= ?
          GROUP BY event_type`,
    args: [since],
  });

  const photoViews = await getTurso().execute(
    "SELECT COALESCE(SUM(view_count), 0) AS total FROM photos WHERE active = 1",
  );

  const bookings = await getTurso().execute(
    "SELECT COUNT(*) AS count FROM bookings WHERE status != 'cancelled'",
  );

  const newBookings = await getTurso().execute({
    sql: "SELECT COUNT(*) AS count FROM bookings WHERE created_at >= ? AND status = 'new'",
    args: [since],
  });

  const byType: Record<string, number> = {};
  for (const row of events.rows) {
    byType[String(row.event_type)] = Number(row.count);
  }

  return {
    days,
    homeViews: byType.home_view ?? 0,
    bookingSubmits: byType.booking_submit ?? 0,
    downloads: byType.photo_download ?? 0,
    albumViews: byType.album_view ?? 0,
    galleryOpens: byType.gallery_open ?? 0,
    photoViews: Number(photoViews.rows[0]?.total ?? 0),
    totalBookings: Number(bookings.rows[0]?.count ?? 0),
    newBookings: Number(newBookings.rows[0]?.count ?? 0),
  };
}
