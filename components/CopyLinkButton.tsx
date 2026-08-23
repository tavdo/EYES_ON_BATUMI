"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded-full border border-navy/20 bg-white px-4 py-3 text-sm font-medium text-navy"
    >
      {copied ? "ბმული დაკოპირდა" : "ბმულის კოპირება"}
    </button>
  );
}
