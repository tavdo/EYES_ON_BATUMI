"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "@/lib/bookings";
import { bookingWhatsAppUrl } from "@/lib/contact";

const TIME_LABEL: Record<string, string> = {
  morning: "დილა",
  afternoon: "შუადღე",
  evening: "საღამო",
  flexible: "როგორც გამოვა",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  new: "ახალი",
  confirmed: "დადასტურებული",
  done: "დასრულებული",
  cancelled: "გაუქმებული",
};

function formatWhen(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ka-GE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function BookingsPanel({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: BookingStatus) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) return;
      setBookings((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } finally {
      setBusyId(null);
    }
  }

  const fresh = bookings.filter((item) => item.status === "new").length;

  return (
    <section className="mb-14">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-sm tracking-wide text-navy/75">ჯავშნები</h2>
        <p className="text-xs text-navy/40">
          {fresh > 0 ? `${fresh} ახალი` : `${bookings.length} სულ`}
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-navy/45">ჯავშანი ჯერ არ არის.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-2xl border border-navy/10 px-4 py-4 sm:px-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="mt-1 text-sm text-navy/60">
                    {formatWhen(booking.preferred_date)} · {TIME_LABEL[booking.time_of_day] ?? booking.time_of_day}
                  </p>
                </div>
                <span className="rounded-full border border-navy/20 px-3 py-1 text-xs text-navy/65">
                  {STATUS_LABEL[booking.status]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-navy/70">
                <a href={`tel:${booking.phone.replace(/\s/g, "")}`} className="hover:text-terracotta">
                  {booking.phone}
                </a>
                {booking.instagram ? (
                  <a
                    href={`https://www.instagram.com/${booking.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-terracotta"
                  >
                    @{booking.instagram}
                  </a>
                ) : null}
              </div>

              {booking.message ? (
                <p className="mt-3 text-sm leading-relaxed text-navy/65">{booking.message}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={bookingWhatsAppUrl({
                    name: booking.name,
                    preferredDate: booking.preferred_date,
                    timeOfDay: TIME_LABEL[booking.time_of_day] ?? booking.time_of_day,
                    phone: booking.phone,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 rounded-full border border-navy/20 px-4 text-sm text-navy/75 hover:border-terracotta hover:text-terracotta"
                >
                  WhatsApp
                </a>
                {booking.status === "new" ? (
                  <button
                    type="button"
                    disabled={busyId === booking.id}
                    onClick={() => void updateStatus(booking.id, "confirmed")}
                    className="h-9 rounded-full bg-terracotta px-4 text-sm font-medium text-navy disabled:opacity-50"
                  >
                    დადასტურება
                  </button>
                ) : null}
                {booking.status === "confirmed" ? (
                  <button
                    type="button"
                    disabled={busyId === booking.id}
                    onClick={() => void updateStatus(booking.id, "done")}
                    className="h-9 rounded-full bg-terracotta px-4 text-sm font-medium text-navy disabled:opacity-50"
                  >
                    დასრულდა
                  </button>
                ) : null}
                {booking.status !== "cancelled" && booking.status !== "done" ? (
                  <button
                    type="button"
                    disabled={busyId === booking.id}
                    onClick={() => void updateStatus(booking.id, "cancelled")}
                    className="h-9 rounded-full border border-navy/20 px-4 text-sm text-navy/65 hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                  >
                    გაუქმება
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
