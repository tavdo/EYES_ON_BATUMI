import { getTurso, ensureSchema } from "@/lib/db";
import type { VoucherLocale } from "@/lib/voucher-copy";

export type Voucher = {
  code: string;
  locale: VoucherLocale;
  recipient: string;
  issued_on: string;
  expires_on: string;
  created_at: number;
};

type VoucherRow = {
  code: string;
  locale: string;
  recipient: string;
  issued_on: string;
  expires_on: string;
  created_at: number;
};

function mapVoucher(row: VoucherRow): Voucher {
  const locale = row.locale === "en" || row.locale === "ru" ? row.locale : "ka";
  return {
    code: row.code,
    locale,
    recipient: row.recipient,
    issued_on: row.issued_on,
    expires_on: row.expires_on,
    created_at: row.created_at,
  };
}

function padCode(n: number) {
  return `EOB-DV-${String(n).padStart(3, "0")}`;
}

export async function nextVoucherCode() {
  await ensureSchema();
  const result = await getTurso().execute(
    "SELECT code FROM vouchers ORDER BY created_at DESC LIMIT 50",
  );
  let max = 0;
  for (const row of result.rows) {
    const match = String(row.code).match(/EOB-DV-(\d+)/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return padCode(max + 1);
}

export async function listVouchers(limit = 40) {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `SELECT code, locale, recipient, issued_on, expires_on, created_at
          FROM vouchers
          ORDER BY created_at DESC
          LIMIT ?`,
    args: [limit],
  });
  return (result.rows as unknown as VoucherRow[]).map(mapVoucher);
}

export async function createVoucher(input: {
  code: string;
  locale: VoucherLocale;
  recipient: string;
  issued_on: string;
  expires_on: string;
}) {
  await ensureSchema();
  const created_at = Date.now();
  await getTurso().execute({
    sql: `INSERT INTO vouchers (code, locale, recipient, issued_on, expires_on, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(code) DO UPDATE SET
            locale = excluded.locale,
            recipient = excluded.recipient,
            issued_on = excluded.issued_on,
            expires_on = excluded.expires_on`,
    args: [
      input.code,
      input.locale,
      input.recipient,
      input.issued_on,
      input.expires_on,
      created_at,
    ],
  });
  return {
    ...input,
    created_at,
  } satisfies Voucher;
}
