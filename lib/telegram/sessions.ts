import { ensureSchema, getTurso } from "@/lib/db";

export type SessionFlow = "booking" | "addphoto";

export type BookingDraft = {
  preferredDate?: string;
  location?: string;
  sessionType?: string;
};

export type TelegramSession = {
  chat_id: number;
  flow: SessionFlow;
  step: number;
  data: BookingDraft;
};

function parseData(raw: string | null): BookingDraft {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as BookingDraft;
  } catch {
    return {};
  }
}

export async function getSession(chatId: number) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: "SELECT chat_id, flow, step, data FROM telegram_sessions WHERE chat_id = ?",
    args: [chatId],
  });
  const row = result.rows[0];
  if (!row) return null;

  return {
    chat_id: Number(row.chat_id),
    flow: String(row.flow) as SessionFlow,
    step: Number(row.step),
    data: parseData(row.data == null ? null : String(row.data)),
  } satisfies TelegramSession;
}

export async function setSession(input: {
  chatId: number;
  flow: SessionFlow;
  step: number;
  data?: BookingDraft;
}) {
  await ensureSchema();
  await getTurso().execute({
    sql: `INSERT INTO telegram_sessions (chat_id, flow, step, data, updated_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(chat_id) DO UPDATE SET
            flow = excluded.flow,
            step = excluded.step,
            data = excluded.data,
            updated_at = excluded.updated_at`,
    args: [
      input.chatId,
      input.flow,
      input.step,
      JSON.stringify(input.data ?? {}),
      Date.now(),
    ],
  });
}

export async function updateSessionData(chatId: number, data: BookingDraft, step: number) {
  const current = await getSession(chatId);
  if (!current) return;
  await setSession({
    chatId,
    flow: current.flow,
    step,
    data: { ...current.data, ...data },
  });
}

export async function clearSession(chatId: number) {
  await ensureSchema();
  await getTurso().execute({
    sql: "DELETE FROM telegram_sessions WHERE chat_id = ?",
    args: [chatId],
  });
}
