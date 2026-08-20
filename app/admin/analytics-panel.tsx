"use client";

import { useEffect, useState } from "react";

type Summary = {
  homeViews: number;
  bookingSubmits: number;
  downloads: number;
  albumViews: number;
  galleryOpens: number;
  photoViews: number;
  totalBookings: number;
  newBookings: number;
};

export function AdminAnalyticsPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    void fetch("/api/admin/analytics")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setSummary(data as Summary | null));
  }, []);

  if (!summary) {
    return (
      <section className="mb-14 rounded-2xl border border-cream/10 px-5 py-5">
        <h2 className="text-sm tracking-wide text-cream/80">სტატისტიკა (7 დღე)</h2>
        <p className="mt-3 text-sm text-cream/50">იტვირთება...</p>
      </section>
    );
  }

  const items = [
    ["მთავარი", summary.homeViews],
    ["ჯავშანი", summary.bookingSubmits],
    ["ჩამოტვირთვა", summary.downloads],
    ["ალბომი", summary.albumViews],
    ["გალერეა", summary.galleryOpens],
    ["ფოტოს ნახვა", summary.photoViews],
    ["ახალი ჯავშანი", summary.newBookings],
  ] as const;

  return (
    <section className="mb-14 rounded-2xl border border-cream/10 px-5 py-5">
      <h2 className="mb-4 text-sm tracking-wide text-cream/80">სტატისტიკა (7 დღე)</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(([label, value]) => (
          <li key={label} className="rounded-xl border border-cream/10 px-4 py-3">
            <p className="text-xs text-cream/45">{label}</p>
            <p className="mt-1 text-xl font-medium">{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
