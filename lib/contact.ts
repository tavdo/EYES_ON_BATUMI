export const PHONES = [
  { e164: "995550050443", display: "+995 550 05 04 43" },
  { e164: "995568002517", display: "+995 568 00 25 17" },
] as const;

export const PRIMARY_PHONE = PHONES[0];

const WHATSAPP_TEXT = "გამარჯობა, გადაღება მინდა";

export function whatsappUrl(e164: string = PRIMARY_PHONE.e164) {
  return `https://wa.me/${e164}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
}

export function telUrl(e164: string) {
  return `tel:+${e164}`;
}

export const WHATSAPP_URL = whatsappUrl();
