"use client";

import { useState } from "react";
import { TIP_URL } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n";
import { SOCIAL_HANDLE } from "@/lib/social";

export function PhotoActions({ dict, photoId }: { dict: Dictionary; photoId: string }) {
  const [copied, setCopied] = useState(false);

  async function copyShareText() {
    const text = `ჩემი კადრი ბათუმიდან 📸 ${SOCIAL_HANDLE}\neyes.on.batumi`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("", text);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => void copyShareText()}
        className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 hover:border-terracotta hover:text-terracotta"
      >
        {copied ? dict.photoShareCopied : dict.photoShare}
      </button>
      {TIP_URL ? (
        <a
          href={TIP_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 hover:border-terracotta hover:text-terracotta"
        >
          {dict.photoTip}
        </a>
      ) : null}
      <a
        href={`/p/${photoId}`}
        className="sr-only"
        aria-hidden
      >
        link
      </a>
    </div>
  );
}
