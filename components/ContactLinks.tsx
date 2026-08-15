import { PHONES, telUrl, whatsappUrl } from "@/lib/contact";

export function ContactLinks() {
  return (
    <div className="mt-10 border-t border-cream/10 pt-8 text-center">
      <p className="mb-4 text-sm text-cream/60">ან დაგვიკავშირდი პირდაპირ</p>
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
              className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-navy transition-opacity hover:opacity-90"
            >
              WhatsApp
            </a>
            <a
              href={telUrl(phone.e164)}
              className="rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/80 transition-all hover:border-terracotta hover:text-terracotta"
            >
              {phone.display}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
