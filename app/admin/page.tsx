import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listBookings, type Booking } from "@/lib/bookings";
import { isBlobStorageEnabled } from "@/lib/blob-env";
import { listActivePhotos } from "@/lib/photos";
import { AdminDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let photos: Awaited<ReturnType<typeof listActivePhotos>> = [];
  let bookings: Booking[] = [];
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

  return (
    <AdminDashboard
      initialPhotos={photos}
      initialBookings={bookings}
      useBlob={isBlobStorageEnabled()}
      onVercel={Boolean(process.env.VERCEL)}
    />
  );
}
