"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  ka: "ქარ",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setLocale(next: Locale) {
    if (next === locale || busy) return;
    setBusy(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed right-4 top-4 z-20 flex gap-1 rounded-full border border-navy/20 bg-white/95 p-1 shadow-sm backdrop-blur-sm">
      {(["ka", "en", "ru"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={busy}
          onClick={() => void setLocale(item)}
          className={`h-8 min-w-10 rounded-full px-2 text-xs font-medium transition-colors ${
            item === locale
              ? "bg-terracotta text-navy"
              : "text-navy/80 hover:text-navy"
          }`}
        >
          {LABELS[item]}
        </button>
      ))}
    </div>
  );
}
