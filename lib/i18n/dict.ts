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
  howItWorksTitle: string;
  pricingTitle: string;
  pricingFrom: string;
  pricingNote: string;
  locationsTitle: string;
  testimonialsTitle: string;
  seasonalTitle: string;
  seasonalMore: string;
  galleryTitle: string;
  bookTitle: string;
  bookBlurb: string;
  contactDirect: string;
  photoTitle: string;
  photoDownload: string;
  photoInvalid: string;
  photoFooter: string;
  photoShare: string;
  photoShareCopied: string;
  photoTip: string;
  albumTitle: string;
  albumDownload: string;
  albumInvalid: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  ka: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "ქუჩის პორტრეტები ბათუმში",
    book: "დაჯავშნე",
    gallery: "გალერეა",
    whatsapp: "WhatsApp",
    howItWorksTitle: "როგორ მუშაობს",
    pricingTitle: "ფასი",
    pricingFrom: "დან",
    pricingNote: PRICING.noteKa,
    locationsTitle: "სად ვღებულობთ",
    testimonialsTitle: "რას ამბობენ",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].ka,
    seasonalMore: "ყველა კადრი",
    galleryTitle: "არჩეული კადრები",
    bookTitle: "დაჯავშნე გადაღება",
    bookBlurb: "ქუჩის პორტრეტი ბათუმში. დაწერე როდის გინდა და მალე დაგიკავშირდებით.",
    contactDirect: "ან დაგვიკავშირდი პირდაპირ",
    photoTitle: "თქვენი კადრი ბათუმის ქუჩებიდან",
    photoDownload: "ჩამოტვირთე მაღალი ხარისხით",
    photoInvalid: "ეს ბმული არასწორია ან ვადაგასულია",
    photoFooter: "გადაღებულია @eyes_on_batumi-ს მიერ. თუ გააზიარებ, მონიშნე ჩვენი ექაუნთი 🙏",
    photoShare: "Instagram-ის ტექსტის კოპირება",
    photoShareCopied: "კოპირებულია",
    photoTip: "მხარდაჭერა / რჩევა",
    albumTitle: "თქვენი კადრები",
    albumDownload: "ჩამოტვირთვა",
    albumInvalid: "ეს ალბომის ბმული არასწორია ან ვადაგასულია",
  },
  en: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "Street portraits in Batumi",
    book: "Book",
    gallery: "Gallery",
    whatsapp: "WhatsApp",
    howItWorksTitle: "How it works",
    pricingTitle: "Pricing",
    pricingFrom: "from",
    pricingNote: PRICING.noteEn,
    locationsTitle: "Where we shoot",
    testimonialsTitle: "What people say",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].en,
    seasonalMore: "All frames",
    galleryTitle: "Selected frames",
    bookTitle: "Book a shoot",
    bookBlurb:
      "Street portrait in Batumi. Tell us when you want to shoot and we will get back to you.",
    contactDirect: "Or contact us directly",
    photoTitle: "Your frame from Batumi streets",
    photoDownload: "Download full quality",
    photoInvalid: "This link is invalid or expired",
    photoFooter: "Shot by @eyes_on_batumi. Tag us if you share 🙏",
    photoShare: "Copy Instagram caption",
    photoShareCopied: "Copied",
    photoTip: "Tip / support",
    albumTitle: "Your frames",
    albumDownload: "Download",
    albumInvalid: "This album link is invalid or expired",
  },
  ru: {
    tagline: "BATUMI · GEORGIA",
    heroSubtitle: "Уличные портреты в Батуми",
    book: "Забронировать",
    gallery: "Галерея",
    whatsapp: "WhatsApp",
    howItWorksTitle: "Как это работает",
    pricingTitle: "Цена",
    pricingFrom: "от",
    pricingNote: PRICING.noteRu,
    locationsTitle: "Где снимаем",
    testimonialsTitle: "Отзывы",
    seasonalTitle: SEASON_LABELS[ACTIVE_SEASON].ru,
    seasonalMore: "Все кадры",
    galleryTitle: "Избранные кадры",
    bookTitle: "Забронировать съёмку",
    bookBlurb: "Уличный портрет в Батуми. Напишите когда удобно — мы свяжемся с вами.",
    contactDirect: "Или напишите напрямую",
    photoTitle: "Ваш кадр с улиц Батуми",
    photoDownload: "Скачать в полном качестве",
    photoInvalid: "Ссылка недействительна или истекла",
    photoFooter: "Снято @eyes_on_batumi. Отметьте нас если публикуете 🙏",
    photoShare: "Скопировать текст для Instagram",
    photoShareCopied: "Скопировано",
    photoTip: "Поддержать / чаевые",
    albumTitle: "Ваши кадры",
    albumDownload: "Скачать",
    albumInvalid: "Ссылка на альбом недействительна или истекла",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ka;
}

export function localizedField(
  locale: Locale,
  fields: { ka: string; en: string; ru: string },
) {
  return fields[locale] ?? fields.ka;
}
