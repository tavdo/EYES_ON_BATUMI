import { HomeView } from "@/components/HomeView";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n/server";
import { listPublicPhotos, listSeasonPhotos, toClientPhoto, type Photo } from "@/lib/photos";
import { SEO } from "@/lib/seo";
import { ACTIVE_SEASON } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: SEO.title },
  description: SEO.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);

  let photos: Photo[] = [];
  let seasonPhotos: Photo[] = [];
  try {
    [photos, seasonPhotos] = await Promise.all([
      listPublicPhotos().then((items) => items.map(toClientPhoto)),
      listSeasonPhotos(ACTIVE_SEASON).then((items) => items.map(toClientPhoto)),
    ]);
  } catch {
    photos = [];
    seasonPhotos = [];
  }

  return (
    <>
      <JsonLd />
      <HomeView
        locale={locale}
        dict={dict}
        photos={photos}
        seasonPhotos={seasonPhotos}
      />
    </>
  );
}
