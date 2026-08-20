import { HomeView } from "@/components/HomeView";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n/server";
import { listPublicPhotos, listSeasonPhotos, type Photo } from "@/lib/photos";
import { ACTIVE_SEASON } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);

  let photos: Photo[] = [];
  let seasonPhotos: Photo[] = [];
  try {
    [photos, seasonPhotos] = await Promise.all([
      listPublicPhotos(),
      listSeasonPhotos(ACTIVE_SEASON),
    ]);
  } catch {
    photos = [];
    seasonPhotos = [];
  }

  return (
    <HomeView
      locale={locale}
      dict={dict}
      photos={photos}
      seasonPhotos={seasonPhotos}
    />
  );
}
