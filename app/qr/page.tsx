import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR",
  robots: { index: false, follow: false },
};

export default function BrandQrPage() {
  return (
    <main className="qr-shell relative z-20 mx-auto flex min-h-dvh max-w-lg flex-col items-center bg-cream px-5 py-12 text-center">
      <p className="text-[11px] tracking-[0.28em] text-navy/50">eyes.on.batumi</p>
      <h1 className="mt-4 font-serif text-2xl text-navy">საიტის QR</h1>
      <p className="mt-3 max-w-sm text-sm text-navy/70">
        Hokusai ფონტი ფონზე — იგივე, რაც მთავარი გვერდის სათაურზე. მიჰყავს{" "}
        <span className="whitespace-nowrap">www.eyesonbatumi.ge</span>-ზე.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/qr-eyes-on-batumi.png"
        alt="QR code for eyes.on.batumi"
        className="mt-8 w-full max-w-md rounded-[2rem] border border-navy/10 shadow-sm"
      />
      <a
        href="/qr-eyes-on-batumi.png"
        download="eyes-on-batumi-qr.png"
        className="mt-8 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-navy"
      >
        PNG გადმოწერა
      </a>
    </main>
  );
}
