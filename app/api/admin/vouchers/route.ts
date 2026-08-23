import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import type { VoucherLocale } from "@/lib/voucher-copy";
import { createVoucher, nextVoucherCode } from "@/lib/vouchers";

function isLocale(value: unknown): value is VoucherLocale {
  return value === "ka" || value === "en" || value === "ru";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  let body: {
    locale?: unknown;
    recipient?: unknown;
    issued_on?: unknown;
    expires_on?: unknown;
    code?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  const recipient =
    typeof body.recipient === "string" ? body.recipient.trim().slice(0, 80) : "";
  const issued_on = typeof body.issued_on === "string" ? body.issued_on : "";
  const expires_on = typeof body.expires_on === "string" ? body.expires_on : "";
  const code =
    typeof body.code === "string"
      ? body.code.trim().toUpperCase().slice(0, 24)
      : "";
  const locale = isLocale(body.locale) ? body.locale : "ka";

  if (!recipient || !issued_on || !expires_on || !code) {
    return NextResponse.json({ error: "შეავსე სახელი, თარიღები და კოდი" }, { status: 400 });
  }

  try {
    const voucher = await createVoucher({
      code,
      locale,
      recipient,
      issued_on,
      expires_on,
    });
    const nextCode = await nextVoucherCode();
    return NextResponse.json({ voucher, nextCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE") || message.includes("unique")) {
      return NextResponse.json({ error: "ეს კოდი უკვე არსებობს" }, { status: 409 });
    }
    return NextResponse.json({ error: "შენახვა ვერ მოხერხდა" }, { status: 500 });
  }
}
