"use client";

import { useMemo, useRef, useState } from "react";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { VoucherCertificate } from "@/components/VoucherCertificate";
import { VOUCHER_COPY, type VoucherLocale } from "@/lib/voucher-copy";
import { voucherStripPhotos } from "@/lib/voucher-photos";
import { voucherPath, type Voucher } from "@/lib/vouchers";

type Props = {
  initialCode: string;
  initialVouchers: Voucher[];
  origin: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function plusYearIso() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export function VoucherStudio({ initialCode, initialVouchers, origin }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState<VoucherLocale>("ka");
  const [recipient, setRecipient] = useState("");
  const [issuedOn, setIssuedOn] = useState(todayIso);
  const [expiresOn, setExpiresOn] = useState(plusYearIso);
  const [code, setCode] = useState(initialCode);
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [savedCode, setSavedCode] = useState<string | null>(
    initialVouchers[0]?.code ?? null,
  );

  const copy = VOUCHER_COPY[locale];
  const liveCode = savedCode ?? code.trim().toUpperCase();
  const publicUrl = `${origin}${voucherPath(liveCode)}`;

  const previewPhotos = useMemo(() => voucherStripPhotos(liveCode || code), [liveCode, code]);

  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          recipient: recipient.trim(),
          issued_on: issuedOn,
          expires_on: expiresOn,
          code: code.trim(),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; voucher?: Voucher; nextCode?: string }
        | null;
      if (!response.ok || !data?.voucher) {
        setMessage(data?.error ?? "შენახვა ვერ მოხერხდა");
        return null;
      }
      setVouchers((current) => [
        data.voucher!,
        ...current.filter((item) => item.code !== data.voucher!.code),
      ]);
      setCode(data.voucher.code);
      setSavedCode(data.voucher.code);
      setMessage("შენახულია — გააზიარე ბმული");
      return data.voucher;
    } catch {
      setMessage("შენახვა ვერ მოხერხდა");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function printVoucher() {
    const saved = await save();
    if (!saved) return;
    window.print();
  }

  async function downloadPng() {
    const node = sheetRef.current;
    if (!node) return;
    setBusy(true);
    setMessage("");
    try {
      await save();
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#16202A",
      });
      const link = document.createElement("a");
      link.download = `${code.trim() || "voucher"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setMessage("PNG ვერ ჩამოიტვირთა — სცადე ბეჭდვა / PDF");
    } finally {
      setBusy(false);
    }
  }

  function loadVoucher(item: Voucher) {
    setLocale(item.locale);
    setRecipient(item.recipient);
    setIssuedOn(item.issued_on);
    setExpiresOn(item.expires_on);
    setCode(item.code);
    setSavedCode(item.code);
    setMessage("");
  }

  return (
    <div className="voucher-studio mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <a href="/admin" className="text-xs tracking-wide text-navy/55 hover:text-navy">
            ← ადმინი
          </a>
          <h1 className="mt-3 font-serif text-2xl text-navy">სასაჩუქრე ვაუჩერი</h1>
          <p className="mt-2 max-w-md text-sm text-navy/70">
            შეინახე ვაუჩერი და გააზიარე ონლაინ ბმული. მიმღები გახსნის ბარათს ტელეფონზე.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <form
          className="surface print:hidden h-fit space-y-4 rounded-3xl p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <label className="block text-xs font-medium text-navy/70">
            ენა
            <select
              className="field mt-2 w-full"
              value={locale}
              onChange={(event) => setLocale(event.target.value as VoucherLocale)}
            >
              <option value="ka">ქართული</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-navy/70">
            მიმღები
            <input
              className="field mt-2 w-full"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="ანა"
              required
            />
          </label>
          <label className="block text-xs font-medium text-navy/70">
            თარიღი
            <input
              className="field mt-2 w-full"
              type="date"
              value={issuedOn}
              onChange={(event) => setIssuedOn(event.target.value)}
              required
            />
          </label>
          <label className="block text-xs font-medium text-navy/70">
            ვადა
            <input
              className="field mt-2 w-full"
              type="date"
              value={expiresOn}
              onChange={(event) => setExpiresOn(event.target.value)}
              required
            />
          </label>
          <label className="block text-xs font-medium text-navy/70">
            კოდი
            <input
              className="field mt-2 w-full tracking-wide"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              required
            />
          </label>
          {message ? <p className="text-sm text-terracotta">{message}</p> : null}
          {savedCode ? (
            <div className="space-y-2 rounded-2xl border border-navy/10 bg-white/80 p-3">
              <p className="break-all text-xs text-navy/70">{publicUrl}</p>
              <div className="flex flex-col gap-2">
                <CopyLinkButton url={publicUrl} />
                <a
                  href={voucherPath(savedCode)}
                  className="rounded-full border border-navy/20 bg-white px-4 py-3 text-center text-sm font-medium text-navy"
                  target="_blank"
                  rel="noreferrer"
                >
                  ონლაინ ვაუჩერის გახსნა
                </a>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-terracotta px-4 py-3 text-sm font-semibold text-navy disabled:opacity-60"
            >
              შენახვა
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void printVoucher()}
              className="rounded-full border border-navy/20 bg-white px-4 py-3 text-sm font-medium text-navy"
            >
              შენახვა და ბეჭდვა / PDF
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void downloadPng()}
              className="rounded-full border border-navy/20 bg-white px-4 py-3 text-sm font-medium text-navy"
            >
              PNG გადმოწერა
            </button>
          </div>
        </form>

        <div className="min-w-0">
          <div ref={sheetRef} className="voucher-capture">
            <VoucherCertificate
              locale={locale}
              copy={copy}
              recipient={recipient}
              issuedOn={issuedOn}
              expiresOn={expiresOn}
              code={code}
              photos={previewPhotos}
            />
          </div>
        </div>
      </div>

      {vouchers.length > 0 ? (
        <section className="print:hidden mt-12">
          <h2 className="mb-4 text-sm tracking-wide text-navy/75">ბოლო ვაუჩერები</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vouchers.map((item) => (
              <li key={item.code} className="surface flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
                <button
                  type="button"
                  onClick={() => loadVoucher(item)}
                  className="min-w-0 flex-1 text-left text-sm text-navy"
                >
                  <span className="font-medium text-terracotta">{item.code}</span>
                  <span className="mt-1 block truncate">{item.recipient}</span>
                </button>
                <a
                  href={voucherPath(item.code)}
                  className="shrink-0 text-xs text-navy/60 hover:text-terracotta"
                  target="_blank"
                  rel="noreferrer"
                >
                  ბმული
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
