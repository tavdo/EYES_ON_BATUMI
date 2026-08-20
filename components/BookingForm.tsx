"use client";

import { FormEvent, useMemo, useState } from "react";
import { ContactLinks } from "@/components/ContactLinks";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

export function BookingForm({ dict }: Props) {
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const times = useMemo(
    () =>
      [
        { value: "morning", label: dict.timeMorning },
        { value: "afternoon", label: dict.timeAfternoon },
        { value: "evening", label: dict.timeEvening },
        { value: "flexible", label: dict.timeFlexible },
      ] as const,
    [dict],
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("flexible");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          instagram,
          preferredDate,
          timeOfDay,
          message,
          company,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? dict.formError);
        return;
      }
      setDone(true);
    } catch {
      setError(dict.formError);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-navy/15 px-6 py-10 text-center">
        <p className="font-serif text-2xl">{dict.formSuccessTitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-navy/65">{dict.formSuccessBody}</p>
        <ContactLinks />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="hidden"
        aria-hidden
      />

      <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
        {dict.formName}
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
        {dict.formPhone}
        <input
          required
          type="tel"
          inputMode="tel"
          placeholder="+995"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="field"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
        {dict.formInstagram}
        <input
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
          placeholder="@username"
          className="field"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
          {dict.formDate}
          <input
            required
            type="date"
            min={minDate}
            value={preferredDate}
            onChange={(event) => setPreferredDate(event.target.value)}
            className="field"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
          {dict.formTime}
          <select
            value={timeOfDay}
            onChange={(event) => setTimeOfDay(event.target.value)}
            className="field"
          >
            {times.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-navy/90">
        {dict.formMessage}
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder={dict.formMessagePlaceholder}
          className="field min-h-28 resize-none py-3"
        />
      </label>

      {error ? <p className="text-sm text-terracotta">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-lift mt-2 h-12 rounded-full bg-terracotta text-[15px] font-medium text-navy disabled:opacity-50"
      >
        {pending ? dict.formSubmitting : dict.formSubmit}
      </button>
    </form>
  );
}
