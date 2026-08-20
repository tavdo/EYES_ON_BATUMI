"use client";

import { useEffect } from "react";

export function AnalyticsBeacon({
  event,
  targetId,
}: {
  event: "home_view" | "album_view" | "gallery_open";
  targetId?: string;
}) {
  useEffect(() => {
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, targetId: targetId ?? null }),
    });
  }, [event, targetId]);

  return null;
}
