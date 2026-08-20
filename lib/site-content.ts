export type Season = "summer" | "autumn" | "winter" | "spring";

export const ACTIVE_SEASON: Season = "summer";

export const PRICING = {
  fromGel: 30,
  noteKa: "ფასი დამოკიდებულია ლოკაციაზე და რაოდენობაზე",
  noteEn: "Price depends on location and number of people",
  noteRu: "Цена зависит от локации и количества людей",
};

export const LOCATIONS = [
  "ბულვარი",
  "ძველი ქალაქი",
  "ორპark",
  "Piazza",
  "Batumi streets",
];

export const TESTIMONIALS = [
  {
    quoteKa: "ძალიან ბუნებრივი კადრები — ზუსტად ისე, როგორც ბათუმში ვიგრძენი.",
    quoteEn: "Very natural frames — exactly how Batumi felt.",
    quoteRu: "Очень естественные кадры — как я чувствовал Батуми.",
    author: "Nino",
  },
  {
    quoteKa: "ქუჩაში შევხვდით, 10 წუთში მზად იყო ფოტო.",
    quoteEn: "We met on the street, photos ready in 10 minutes.",
    quoteRu: "Встретились на улице, фото готовы за 10 минут.",
    author: "Marco",
  },
  {
    quoteKa: "Instagram-ზე გაზიარებისას ყველამ კითხა — სად გადაიღე?",
    quoteEn: "Everyone asked on Instagram — where was this shot?",
    quoteRu: "Все спрашивали в Instagram — где это снято?",
    author: "Ana",
  },
];

export const HOW_IT_WORKS = [
  {
    titleKa: "დაჯავშნე ან დაგვიკავშირდი",
    titleEn: "Book or message us",
    titleRu: "Забронируй или напиши",
    bodyKa: "WhatsApp-ით ან ფორმით — დაგიკავშირდებით და შევთანხმდებით ადგილს.",
    bodyEn: "Via WhatsApp or the form — we confirm time and spot.",
    bodyRu: "WhatsApp или форма — согласуем время и место.",
  },
  {
    titleKa: "შევხვდებით ქუჩაში",
    titleEn: "Meet on the street",
    titleRu: "Встреча на улице",
    bodyKa: "ბულვარი, ძველი ქალაქი, ან სადაც გინდა — ბუნებრივი პორტრეტი.",
    bodyEn: "Boulevard, old town, or your spot — natural portraits.",
    bodyRu: "Бульвар, старый город или ваше место — естественный портрет.",
  },
  {
    titleKa: "მიიღე ბმული",
    titleEn: "Get your link",
    titleRu: "Получи ссылку",
    bodyKa: "ფოტოს ბმული ტელეფონზე — ნახავ და ჩამოტვირთავ მაღალი ხარისხით.",
    bodyEn: "Photo link on your phone — view and download full quality.",
    bodyRu: "Ссылка на телефон — просмотр и скачивание в полном качестве.",
  },
];

export const SEASON_LABELS: Record<
  Season,
  { ka: string; en: string; ru: string }
> = {
  summer: { ka: "ზაფხული ბათუმში", en: "Summer in Batumi", ru: "Лето в Батуми" },
  autumn: { ka: "შემოდგომა", en: "Autumn light", ru: "Осенняя свет" },
  winter: { ka: "ზამა", en: "Winter mood", ru: "Зимнее настроение" },
  spring: { ka: "გაზაფხული", en: "Spring streets", ru: "Весенние улицы" },
};
