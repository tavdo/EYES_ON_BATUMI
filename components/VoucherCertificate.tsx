import type { VoucherCopy, VoucherLocale } from "@/lib/voucher-copy";

type Props = {
  locale: VoucherLocale;
  copy: VoucherCopy;
  recipient: string;
  issuedOn: string;
  expiresOn: string;
  code: string;
  photos: string[];
};

function formatLine(iso: string) {
  if (!iso) return "————";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

function PhotoStrip({ urls, side }: { urls: string[]; side: "left" | "right" }) {
  const slots = [0, 1, 2].map((index) => urls[index] ?? null);
  return (
    <div className={`voucher-strip voucher-strip-${side}`}>
      {slots.map((src, index) => (
        <div key={`${side}-${index}`} className="voucher-photo">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" />
          ) : (
            <div className="voucher-photo-fallback" />
          )}
        </div>
      ))}
    </div>
  );
}

export function VoucherCertificate({
  locale,
  copy,
  recipient,
  issuedOn,
  expiresOn,
  code,
  photos,
}: Props) {
  const left = photos.slice(0, 3);
  const right = photos.slice(3, 6);

  return (
    <article className="voucher-sheet" data-locale={locale}>
      <PhotoStrip urls={left} side="left" />
      <div className="voucher-center">
        <p className="voucher-brand">eyes.on.batumi</p>
        <p className="voucher-tagline">{copy.tagline}</p>
        <h2 className="voucher-title">
          {copy.title.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <div className="voucher-rule" />
        <p className="voucher-body">{copy.body}</p>
        <div className="voucher-seal" aria-hidden>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="58" fill="#D97B4F" />
            <circle cx="60" cy="60" r="40" fill="#16202A" />
            <defs>
              <path
                id="voucher-seal-path"
                d="M60,60 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"
              />
            </defs>
            <text fill="#F7F2EA" fontSize="7.4" letterSpacing="1.6" fontFamily="sans-serif">
              <textPath href="#voucher-seal-path">
                EXPERIENCE BATUMI THROUGH THE LENS · EXPERIENCE BATUMI THROUGH THE LENS ·
              </textPath>
            </text>
            <text
              x="60"
              y="64"
              textAnchor="middle"
              fill="#F7F2EA"
              fontSize="11"
              fontFamily="serif"
              letterSpacing="1"
            >
              EOB
            </text>
          </svg>
        </div>
        <p className="voucher-field">
          <span>{copy.to}</span>
          <span className="voucher-line">{recipient || "\u00a0"}</span>
        </p>
        <p className="voucher-hint">{copy.recipientHint}</p>
        <div className="voucher-meta">
          <p>
            {copy.date} <span className="voucher-line short">{formatLine(issuedOn)}</span>
            <span className="voucher-sep">|</span>
            {copy.validUntil} <span className="voucher-line short">{formatLine(expiresOn)}</span>
          </p>
          <p className="voucher-code">{code}</p>
        </div>
        <p className="voucher-foot">{copy.delivery}</p>
        <p className="voucher-foot">{copy.book}</p>
      </div>
      <PhotoStrip urls={right} side="right" />
    </article>
  );
}
