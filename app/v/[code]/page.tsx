import type { Metadata } from "next";
import Link from "next/link";
import { VoucherCertificate } from "@/components/VoucherCertificate";
import { WHATSAPP_URL, whatsappUrl, PRIMARY_PHONE } from "@/lib/contact";
import { listActivePhotos } from "@/lib/photos";
import { siteUrl } from "@/lib/site-url";
import { VOUCHER_COPY } from "@/lib/voucher-copy";
import { getVoucherByCode, isVoucherExpired } from "@/lib/vouchers";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
};

async function sidePhotos() {
  try {
    const items = await listActivePhotos();
    return items.slice(0, 12).map((photo) => `/api/photos/${photo.id}/preview`);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const voucher = await getVoucherByCode(decodeURIComponent(code));
  if (!voucher) {
    return {
      title: "eyes.on.batumi",
      robots: { index: false, follow: false, nocache: true },
    };
  }
  return {
    title: `${voucher.recipient} — სასაჩუქრე ვაუჩერი`,
    description: "eyes.on.batumi gift voucher",
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      title: `Gift voucher for ${voucher.recipient}`,
      url: `${siteUrl()}/v/${encodeURIComponent(voucher.code)}`,
    },
  };
}

export default async function PublicVoucherPage({ params }: PageProps) {
  const { code } = await params;
  const voucher = await getVoucherByCode(decodeURIComponent(code));
  const photos = await sidePhotos();
  const copy = voucher ? VOUCHER_COPY[voucher.locale] : VOUCHER_COPY.ka;
  const expired = voucher ? isVoucherExpired(voucher.expires_on) : false;
  const bookMessage = voucher
    ? `გამარჯობა, მაქვს სასაჩუქრე ვაუჩერი ${voucher.code} (${voucher.recipient})`
    : "გამარჯობა, გადაღება მინდა";
  const whatsapp = whatsappUrl(PRIMARY_PHONE.e164, bookMessage);

  if (!voucher) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <Link href="/" className="mb-12 text-[11px] tracking-[0.28em] text-navy/50">
          eyes.on.batumi
        </Link>
        <p className="max-w-sm text-center font-serif text-xl leading-relaxed text-navy/85">
          {VOUCHER_COPY.ka.pageInvalid}
        </p>
      </main>
    );
  }

  return (
    <main className="voucher-page mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 text-center print:hidden">
        <Link href="/" className="text-[11px] tracking-[0.28em] text-navy/50 hover:text-navy">
          eyes.on.batumi
        </Link>
        <p className="mt-5 text-xs tracking-[0.2em] text-navy/60">{copy.pageEyebrow}</p>
        <h1 className="mt-3 font-serif text-2xl text-navy sm:text-3xl">{voucher.recipient}</h1>
        {expired ? (
          <p className="mt-4 text-sm font-medium text-terracotta">{copy.pageExpired}</p>
        ) : null}
      </header>

      <VoucherCertificate
        locale={voucher.locale}
        copy={copy}
        recipient={voucher.recipient}
        issuedOn={voucher.issued_on}
        expiresOn={voucher.expires_on}
        code={voucher.code}
        photos={photos}
      />

      <div className="print:hidden mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {!expired ? (
          <>
            <Link
              href="/#book"
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full bg-terracotta px-6 text-sm font-semibold text-navy sm:w-auto"
            >
              {copy.pageBook}
            </Link>
            <a
              href={whatsapp || WHATSAPP_URL}
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full border border-navy/20 bg-white px-6 text-sm font-medium text-navy sm:w-auto"
              target="_blank"
              rel="noreferrer"
            >
              {copy.pageWhatsapp}
            </a>
          </>
        ) : (
          <Link href="/" className="text-sm text-navy/70 underline">
            eyes.on.batumi
          </Link>
        )}
      </div>
    </main>
  );
}
