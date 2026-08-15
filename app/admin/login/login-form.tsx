"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "შესვლა ვერ მოხერხდა");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("შესვლა ვერ მოხერხდა");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm text-cream/80">
        პაროლი
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-full border border-cream/20 bg-transparent px-5 text-cream outline-none transition-colors focus:border-terracotta"
        />
      </label>
      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-terracotta text-[15px] font-medium text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "..." : "შესვლა"}
      </button>
    </form>
  );
}
