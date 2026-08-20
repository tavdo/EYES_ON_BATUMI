"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QrButton({ url, label = "QR" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    void QRCode.toDataURL(url, {
      margin: 1,
      width: 220,
      color: { dark: "#16202A", light: "#F4EDE2" },
    }).then(setDataUrl);
  }, [open, url]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 rounded-full border border-cream/20 px-4 text-sm text-cream/80 hover:border-terracotta hover:text-terracotta"
      >
        {label}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-3xl border border-cream/15 bg-navy px-6 py-8 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="QR" className="mx-auto rounded-2xl" />
            ) : (
              <p className="text-sm text-cream/60">...</p>
            )}
            <p className="mt-4 max-w-xs break-all text-xs text-cream/50">{url}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-navy"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
