import { redirect } from "next/navigation";
import { listAlbumsForAdminDetailed } from "@/lib/albums";
import { isAdminAuthenticated } from "@/lib/auth";
import { listBookings, type Booking } from "@/lib/bookings";
import { isBlobStorageEnabled } from "@/lib/blob-env";
import { listActivePhotos } from "@/lib/photos";
import { botUsername } from "@/lib/telegram/config";
import { AdminDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let photos: Awaited<ReturnType<typeof listActivePhotos>> = [];
  let bookings: Booking[] = [];
  let albums: Awaited<ReturnType<typeof listAlbumsForAdminDetailed>> = [];
  try {
    photos = await listActivePhotos();
  } catch {
    photos = [];
  }
  try {
    bookings = await listBookings();
  } catch {
    bookings = [];
  }
  try {
    albums = await listAlbumsForAdminDetailed();
  } catch {
    albums = [];
  }

  const username = botUsername().replace(/^@/, "") || "EYESONBATUMIbot";

  return (
    <AdminDashboard
      initialPhotos={photos}
      initialBookings={bookings}
      initialAlbums={albums}
      useBlob={isBlobStorageEnabled()}
      onVercel={Boolean(process.env.VERCEL)}
      botUsername={username}
    />
  );
}
