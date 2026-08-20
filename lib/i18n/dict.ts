import {
  ACTIVE_SEASON,
  PRICING,
  SEASON_LABELS,
} from "@/lib/site-content";

export const LOCALES = ["ka", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "eob_locale";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type Dictionary = {
  tagline: string;
  heroSubtitle: string;
  book: string;
  gallery: string;
  whatsapp: string;
  telegram: string;
  howItWorksTitle: string;
  pricingTitle: string;
  pricingNote: string;
  locationsTitle: string;
  testimonialsTitle: string;
  seasonalTitle: string;
  seasonalMore: string;
  galleryTitle: string;
  galleryOpen: string;
  bookTitle: string;
  bookBlurb: string;
  contactDirect: string;
  formName: string;
  formPhone: string;
  formInstagram: string;
  formDate: string;
  formTime: string;
  formMessage: string;
  formMessagePlaceholder: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccessTitle: string;
  formSuccessBody: string;
  formError: string;
  timeMorning: string;
  timeAfternoon: string;
  timeEvening: string;
  timeFlexible: string;
  photoTitle: string;
  photoDownload: string;
  photoInvalid: string;
  photoFooter: string;
  photoShare: string;
  photoShareCopied: string;
  photoShareText: string;
  photoTip: string;
  albumTitle: string;
  albumDownload: string;
  albumFrames: string;
  albumInvalid: string;
};

function pricingLine(locale: Locale) {
  if (locale === "ka") return `${PRICING.fromGel} ₾-დან`;
  if (locale === "ru") return `от ${PRICING.fromGel} ₾`;
  return `from ${PRICING.fromGel} ₾`;
}

const dictionaries: Record<Locale, Dictionary> = {
  ka: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "ქუჩის პორტრეტები ბათუმში",
    book: "დაჯავშნე",
    gallery: "გალერეა",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    howItWorksTitle: "როგორ მუშაობს",
    pricingTitle: "ფასი",
    pricingNote: PRICING.noteKa,
    locationsTitle: "სად ვღებულობთ",
    testimonialsTitle: "რას ამბობენ",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].ka,
    seasonalMore: "ყველა კადრი",
    galleryTitle: "არჩეული კადრები",
    galleryOpen: "ნახვა",
    bookTitle: "დაჯავშნე გადაღება",
    bookBlurb: "ქუჩის პორტრეტი ბათუმში. დაწერე როდის გინდა და მალე დაგიკავშირდებით.",
    contactDirect: "ან დაგვიკავშირდი პირდაპირ",
    formName: "სახელი",
    formPhone: "ტელეფონი",
    formInstagram: "Instagram",
    formDate: "სასურველი თარიღი",
    formTime: "დრო",
    formMessage: "შეტყობინება",
    formMessagePlaceholder: "რამდენი ადამიანი, სად შევხვდეთ...",
    formSubmit: "დაჯავშნე გადაღება",
    formSubmitting: "იგზავნება...",
    formSuccessTitle: "მიღებულია",
    formSuccessBody:
      "მოთხოვნა გაიგზავნა. მალე დაგიკავშირდებით, ან შეგიძლია ახლავე დაგვწერო WhatsApp-ზე.",
    formError: "გაგზავნა ვერ მოხერხდა",
    timeMorning: "დილა",
    timeAfternoon: "შუადღე",
    timeEvening: "საღამო",
    timeFlexible: "როგორც გამოვა",
    photoTitle: "თქვენი კადრი ბათუმის ქუჩებიდან",
    photoDownload: "ჩამოტვირთე მაღალი ხარისხით",
    photoInvalid: "ეს ბმული არასწორია ან ვადაგასულია",
    photoFooter: "გადაღებულია @eyes_on_batumi-ს მიერ. თუ გააზიარებ, მონიშნე ჩვენი ექაუნთი 🙏",
    photoShare: "Instagram-ის ტექსტის კოპირება",
    photoShareCopied: "კოპირებულია",
    photoShareText: "ჩემი კადრი ბათუმიდან 📸 @eyes_on_batumi\neyes.on.batumi",
    photoTip: "მხარდაჭერა",
    albumTitle: "თქვენი კადრები",
    albumDownload: "ჩამოტვირთვა",
    albumFrames: "კადრი",
    albumInvalid: "ეს ალბომის ბმული არასწორია ან ვადაგასულია",
  },
  en: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "Street portraits in Batumi",
    book: "Book",
    gallery: "Gallery",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    howItWorksTitle: "How it works",
    pricingTitle: "Pricing",
    pricingNote: PRICING.noteEn,
    locationsTitle: "Where we shoot",
    testimonialsTitle: "What people say",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].en,
    seasonalMore: "All frames",
    galleryTitle: "Selected frames",
    galleryOpen: "View photo",
    bookTitle: "Book a shoot",
    bookBlurb:
      "Street portrait in Batumi. Tell us when you want to shoot and we will get back to you.",
    contactDirect: "Or contact us directly",
    formName: "Name",
    formPhone: "Phone",
    formInstagram: "Instagram",
    formDate: "Preferred date",
    formTime: "Time",
    formMessage: "Message",
    formMessagePlaceholder: "How many people, where to meet...",
    formSubmit: "Book a shoot",
    formSubmitting: "Sending...",
    formSuccessTitle: "Received",
    formSuccessBody:
      "Your request was sent. We will get back to you soon, or message us on WhatsApp now.",
    formError: "Could not send request",
    timeMorning: "Morning",
    timeAfternoon: "Afternoon",
    timeEvening: "Evening",
    timeFlexible: "Flexible",
    photoTitle: "Your frame from Batumi streets",
    photoDownload: "Download full quality",
    photoInvalid: "This link is invalid or expired",
    photoFooter: "Shot by @eyes_on_batumi. Tag us if you share 🙏",
    photoShare: "Copy Instagram caption",
    photoShareCopied: "Copied",
    photoShareText: "My frame from Batumi 📸 @eyes_on_batumi\neyes.on.batumi",
    photoTip: "Tip / support",
    albumTitle: "Your frames",
    albumDownload: "Download",
    albumFrames: "frames",
    albumInvalid: "This album link is invalid or expired",
  },
  ru: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "Уличные портреты в Батуми",
    book: "Забронировать",
    gallery: "Галерея",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    howItWorksTitle: "Как это работает",
    pricingTitle: "Цена",
    pricingNote: PRICING.noteRu,
    locationsTitle: "Где снимаем",
    testimonialsTitle: "Отзывы",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].ru,
    seasonalMore: "Все кадры",
    galleryTitle: "Избранные кадры",
    galleryOpen: "Открыть",
    bookTitle: "Забронировать съёмку",
    bookBlurb: "Уличный портрет в Батуми. Напишите когда удобно — мы свяжемся с вами.",
    contactDirect: "Или напишите напрямую",
    formName: "Имя",
    formPhone: "Телефон",
    formInstagram: "Instagram",
    formDate: "Желаемая дата",
    formTime: "Время",
    formMessage: "Сообщение",
    formMessagePlaceholder: "Сколько человек, где встретиться...",
    formSubmit: "Забронировать",
    formSubmitting: "Отправка...",
    formSuccessTitle: "Принято",
    formSuccessBody:
      "Запрос отправлен. Мы скоро свяжемся с вами, или напишите нам в WhatsApp.",
    formError: "Не удалось отправить",
    timeMorning: "Утро",
    timeAfternoon: "День",
    timeEvening: "Вечер",
    timeFlexible: "Как получится",
    photoTitle: "Ваш кадр с улиц Батуми",
    photoDownload: "Скачать в полном качестве",
    photoInvalid: "Ссылка недействительна или истекла",
    photoFooter: "Снято @eyes_on_batumi. Отметьте нас если публикуете 🙏",
    photoShare: "Скопировать текст для Instagram",
    photoShareCopied: "Скопировано",
    photoShareText: "Мой кадр из Батуми 📸 @eyes_on_batumi\neyes.on.batumi",
    photoTip: "Поддержать",
    albumTitle: "Ваши кадры",
    albumDownload: "Скачать",
    albumFrames: "кадров",
    albumInvalid: "Ссылка на альбом недействительна или истекла",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ka;
}

export function getPricingLine(locale: Locale) {
  return pricingLine(locale);
}

export function localizedField(
  locale: Locale,
  fields: { ka: string; en: string; ru: string },
) {
  return fields[locale] ?? fields.ka;
}
