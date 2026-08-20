import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { createBooking, isBookingTime } from "@/lib/bookings";
import { notifyNewBooking } from "@/lib/notify";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,20}$/;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  if (clean(body.company, 80)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 24);
  const instagram = clean(body.instagram, 60).replace(/^@/, "") || null;
  const preferredDate = clean(body.preferredDate, 10);
  const timeOfDay = clean(body.timeOfDay, 20);
  const message = clean(body.message, 500) || null;

  if (name.length < 2) {
    return NextResponse.json({ error: "სახელი აუცილებელია" }, { status: 400 });
  }
  if (!PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ error: "ტელეფონის ნომერი არასწორია" }, { status: 400 });
  }
  if (!DATE_PATTERN.test(preferredDate)) {
    return NextResponse.json({ error: "თარიღი აუცილებელია" }, { status: 400 });
  }
  if (!isBookingTime(timeOfDay)) {
    return NextResponse.json({ error: "აირჩიე დრო" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(`${preferredDate}T00:00:00`) < today) {
    return NextResponse.json({ error: "თარიღი წარსულშია" }, { status: 400 });
  }

  try {
    await createBooking({
      name,
      phone,
      instagram,
      preferredDate,
      timeOfDay,
      message,
    });
  } catch (error) {
    console.error("booking create failed", error);
    return NextResponse.json({ error: "გაგზავნა ვერ მოხერხდა" }, { status: 500 });
  }

  try {
    await trackEvent("booking_submit");
  } catch (error) {
    console.error("booking analytics failed", error);
  }

  try {
    const notified = await notifyNewBooking({
      name,
      phone,
      instagram,
      preferredDate,
      timeOfDay,
      message,
    });
    if (!notified) {
      console.error("booking telegram notify skipped or failed");
    }
  } catch (error) {
    console.error("booking telegram notify failed", error);
  }

  return NextResponse.json({ ok: true });
}
