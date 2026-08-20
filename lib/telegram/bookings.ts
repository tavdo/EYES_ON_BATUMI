import { nanoid } from "nanoid";
import { ensureSchema, getTurso } from "@/lib/db";

export type TelegramBookingStatus = "pending" | "confirmed" | "declined";

export type TelegramBooking = {
  id: string;
  telegram_user_id: number;
  telegram_username: string | null;
  preferred_date: string;
  location: string;
  session_type: string;
  contact: string;
  status: TelegramBookingStatus;
  created_at: number;
};

type Row = TelegramBooking;

function mapRow(row: Row): TelegramBooking {
  return {
    id: String(row.id),
    telegram_user_id: Number(row.telegram_user_id),
    telegram_username: row.telegram_username,
    preferred_date: String(row.preferred_date),
    location: String(row.location),
    session_type: String(row.session_type),
    contact: String(row.contact),
    status: row.status as TelegramBookingStatus,
    created_at: Number(row.created_at),
  };
}

export async function createTelegramBooking(input: {
  telegramUserId: number;
  telegramUsername: string | null;
  preferredDate: string;
  location: string;
  sessionType: string;
  contact: string;
}) {
  await ensureSchema();
  const id = nanoid(8);
  const createdAt = Date.now();

  await getTurso().execute({
    sql: `INSERT INTO telegram_bookings (
            id, telegram_user_id, telegram_username, preferred_date, location,
            session_type, contact, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    args: [
      id,
      input.telegramUserId,
      input.telegramUsername,
      input.preferredDate,
      input.location,
      input.sessionType,
      input.contact,
      createdAt,
    ],
  });

  return id;
}

export async function getTelegramBooking(id: string) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `SELECT id, telegram_user_id, telegram_username, preferred_date, location,
                 session_type, contact, status, created_at
          FROM telegram_bookings WHERE id = ?`,
    args: [id],
  });
  const row = result.rows[0] as unknown as Row | undefined;
  return row ? mapRow(row) : null;
}

export async function listPendingTelegramBookings() {
  await ensureSchema();
  const result = await getTurso().execute(
    `SELECT id, telegram_user_id, telegram_username, preferred_date, location,
            session_type, contact, status, created_at
     FROM telegram_bookings
     WHERE status = 'pending'
     ORDER BY created_at DESC`,
  );
  return (result.rows as unknown as Row[]).map(mapRow);
}

export async function setTelegramBookingStatus(
  id: string,
  status: TelegramBookingStatus,
) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "UPDATE telegram_bookings SET status = ? WHERE id = ?",
    args: [status, id],
  });
  return result.rowsAffected > 0;
}
