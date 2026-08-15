import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "./db";

export const BOOKING_TIMES = ["morning", "afternoon", "evening", "flexible"] as const;
export const BOOKING_STATUSES = ["new", "confirmed", "done", "cancelled"] as const;

export type BookingTime = (typeof BOOKING_TIMES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: string;
  name: string;
  phone: string;
  instagram: string | null;
  preferred_date: string;
  time_of_day: BookingTime;
  message: string | null;
  status: BookingStatus;
  created_at: number;
};

type BookingRow = Booking;

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    instagram: row.instagram,
    preferred_date: row.preferred_date,
    time_of_day: row.time_of_day,
    message: row.message,
    status: row.status,
    created_at: Number(row.created_at),
  };
}

export function isBookingTime(value: string): value is BookingTime {
  return (BOOKING_TIMES as readonly string[]).includes(value);
}

export function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(value);
}

export async function createBooking(input: {
  name: string;
  phone: string;
  instagram: string | null;
  preferredDate: string;
  timeOfDay: BookingTime;
  message: string | null;
}) {
  await ensureSchema();
  const id = nanoid(16);
  const createdAt = Date.now();

  await getTurso().execute({
    sql: `INSERT INTO bookings (
            id, name, phone, instagram, preferred_date, time_of_day, message, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    args: [
      id,
      input.name,
      input.phone,
      input.instagram,
      input.preferredDate,
      input.timeOfDay,
      input.message,
      createdAt,
    ],
  });

  return id;
}

export async function listBookings() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT id, name, phone, instagram, preferred_date, time_of_day, message, status, created_at
     FROM bookings
     ORDER BY created_at DESC`,
  );

  return (result.rows as unknown as BookingRow[]).map(mapBooking);
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE bookings SET status = ? WHERE id = ?",
    args: [status, id],
  });
  return result.rowsAffected > 0;
}
