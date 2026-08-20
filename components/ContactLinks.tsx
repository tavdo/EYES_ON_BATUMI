import { PHONES, telUrl, whatsappUrl } from "@/lib/contact";
import { TELEGRAM_BOT_URL } from "@/lib/social";

export function ContactLinks({
  label,
  telegramLabel = "Telegram",
}: {
  label?: string;
  telegramLabel?: string;
}) {
  return (
    <div className="mt-10 border-t border-navy/10 pt-8 text-center">
      <p className="mb-4 text-sm font-medium text-navy/80">{label ?? "ან დაგვიკავშირდი პირდაპირ"}</p>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        <a
          href={TELEGRAM_BOT_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-navy transition-opacity hover:opacity-90"
        >
          {telegramLabel}
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-navy/25 bg-white px-5 py-2.5 text-sm font-medium text-navy transition-all hover:border-terracotta hover:text-terracotta"
        >
          WhatsApp
        </a>
      </div>
      <div className="flex flex-col gap-3">
        {PHONES.map((phone) => (
          <div
            key={phone.e164}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <a
              href={whatsappUrl(phone.e164)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-navy/25 bg-white px-4 py-2 text-sm font-medium text-navy transition-all hover:border-terracotta hover:text-terracotta"
            >
              WhatsApp
            </a>
            <a
              href={telUrl(phone.e164)}
              className="rounded-full border border-navy/25 bg-white px-4 py-2 text-sm font-medium text-navy transition-all hover:border-terracotta hover:text-terracotta"
            >
              {phone.display}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
