import { PHONES } from "@/lib/contact";
import { INSTAGRAM_URL, TIKTOK_URL, TELEGRAM_BOT_URL } from "@/lib/social";
import { siteUrl } from "@/lib/site-url";

export const SITE_NAME = "eyes.on.batumi";
export const SITE_LEGAL_NAME = "eyes.on.batumi street portraits";

export const SEO = {
  title: "eyes.on.batumi | ქუჩის პორტრეტები ბათუმში",
  description:
    "ქუჩის პორტრეტები ბათუმში. ბულვარი, ძველი ქალაქი, პარკი — ბუნებრივი კადრები სტუდიის გარეშე. Street portraits in Batumi, Georgia.",
  keywords: [
    "eyes.on.batumi",
    "eyesonbatumi",
    "ქუჩის პორტრეტი ბათუმი",
    "ფოტოგრაფი ბათუმი",
    "street photographer Batumi",
    "street portrait Batumi",
    "photoshoot Batumi",
    "ფოტოსესია ბათუმი",
  ],
};

export function localBusinessJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: SITE_NAME,
    alternateName: ["eyesonbatumi", "eyes on batumi", "Eyes on Batumi"],
    url,
    image: `${url}/opengraph-image`,
    telephone: `+${PHONES[0].e164}`,
    priceRange: "₾₾",
    currenciesAccepted: "GEL",
    areaServed: {
      "@type": "City",
      name: "Batumi",
      containedInPlace: { "@type": "Country", name: "Georgia" },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Batumi",
      addressRegion: "Adjara",
      addressCountry: "GE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.6168,
      longitude: 41.6367,
    },
    description: SEO.description,
    sameAs: [INSTAGRAM_URL, TIKTOK_URL, TELEGRAM_BOT_URL],
    makesOffer: {
      "@type": "Offer",
      name: "Street portrait photoshoot in Batumi",
      availability: "https://schema.org/InStock",
    },
  };
}
