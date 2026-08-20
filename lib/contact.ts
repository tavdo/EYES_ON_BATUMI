export const PHONES = [
  { e164: "995550050443", display: "+995 550 05 04 43" },
  { e164: "995568002517", display: "+995 568 00 25 17" },
] as const;

export const PRIMARY_PHONE = PHONES[0];

const WHATSAPP_TEXT = "გამარჯობა, გადაღება მინდა";

export function whatsappUrl(e164: string = PRIMARY_PHONE.e164, text: string = WHATSAPP_TEXT) {
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;
}

export function telUrl(e164: string) {
  return `tel:+${e164}`;
}

const BOOKING_CONFIRM_TEXT = "გამარჯობა";

export function bookingWhatsAppUrl(input: {
  name: string;
  preferredDate: string;
  timeOfDay: string;
  phone: string;
}) {
  const text = `${BOOKING_CONFIRM_TEXT} ${input.name}! დადასტურდა გადაღება ${input.preferredDate}-ზე (${input.timeOfDay}).`;
  return whatsappUrl(PRIMARY_PHONE.e164, text);
}

export const WHATSAPP_URL = whatsappUrl();

export const TIP_URL =
  process.env.NEXT_PUBLIC_TIP_URL?.trim() || process.env.TIP_URL?.trim() || "";
