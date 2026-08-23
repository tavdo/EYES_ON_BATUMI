export type VoucherLocale = "ka" | "en" | "ru";

export type VoucherCopy = {
  tagline: string;
  title: string;
  body: string;
  to: string;
  recipientHint: string;
  date: string;
  validUntil: string;
  delivery: string;
  book: string;
  pageEyebrow: string;
  pageBook: string;
  pageWhatsapp: string;
  pageExpired: string;
  pageInvalid: string;
};

export const VOUCHER_COPY: Record<VoucherLocale, VoucherCopy> = {
  ka: {
    tagline: "ქუჩის ფოტოგრაფი",
    title: "სასაჩუქრე ვაუჩერი:\nერთდღიანი ფოტოსესიის გამოცდილება",
    body: "ეს ვაუჩერი მფლობელს აძლევს უფლებას სრული დღის ფოტოსესიაზე ბათუმის ნებისმიერ წერტილში. სტუდიის გარეშე. სუფთა ატმოსფერო.",
    to: "ვისთვის:",
    recipientHint: "(მიმღების სახელი)",
    date: "თარიღი:",
    validUntil: "ვადა იწურება:",
    delivery: "მიწოდება: პირადი ციფრული გალერეა და წვდომა Telegram-ით.",
    book: "დაჯავშნა: eyesonbatumi.ge",
    pageEyebrow: "ონლაინ სასაჩუქრე ვაუჩერი",
    pageBook: "დაჯავშნე ამ ვაუჩერით",
    pageWhatsapp: "WhatsApp-ით დაჯავშნა",
    pageExpired: "ამ ვაუჩერის ვადა ამოიწურა.",
    pageInvalid: "ეს ბმული აღარ მოქმედებს ან კოდი არასწორია.",
  },
  en: {
    tagline: "STREET PORTRAIT PHOTOGRAPHER",
    title: "GIFT VOUCHER:\nONE-DAY PHOTOSHOOT EXPERIENCE",
    body: "THIS VOUCHER ENTITLES THE BEARER TO A FULL DAY PHOTOSHOOT SESSION ANYWHERE IN BATUMI. NO STUDIO. PURE ATMOSPHERE.",
    to: "TO:",
    recipientHint: "(RECIPIENT'S NAME)",
    date: "DATE:",
    validUntil: "VALID UNTIL:",
    delivery: "DELIVERY: PRIVATE DIGITAL GALLERY & TELEGRAM ACCESS.",
    book: "BOOK VIA: eyesonbatumi.ge",
    pageEyebrow: "Online gift voucher",
    pageBook: "Book with this voucher",
    pageWhatsapp: "Book on WhatsApp",
    pageExpired: "This voucher has expired.",
    pageInvalid: "This link is invalid or the voucher was removed.",
  },
  ru: {
    tagline: "УЛИЧНЫЙ ПОРТРЕТНЫЙ ФОТОГРАФ",
    title: "ПОДАРОЧНЫЙ ВАУЧЕР:\nОДНОДНЕВНАЯ ФОТОСЕССИЯ",
    body: "ЭТОТ ВАУЧЕР ДАЁТ ПРАВО НА ПОЛНЫЙ ДЕНЬ СЪЁМКИ В ЛЮБОЙ ТОЧКЕ БАТУМИ. БЕЗ СТУДИИ. ЧИСТАЯ АТМОСФЕРА.",
    to: "КОМУ:",
    recipientHint: "(имя получателя)",
    date: "ДАТА:",
    validUntil: "ДЕЙСТВИТЕЛЕН ДО:",
    delivery: "ДОСТАВКА: ЛИЧНАЯ ЦИФРОВАЯ ГАЛЕРЕЯ И TELEGRAM.",
    book: "БРОНЬ: eyesonbatumi.ge",
    pageEyebrow: "Онлайн подарочный ваучер",
    pageBook: "Забронировать по ваучеру",
    pageWhatsapp: "Забронировать в WhatsApp",
    pageExpired: "Срок этого ваучера истёк.",
    pageInvalid: "Ссылка недействительна или ваучер удалён.",
  },
};
