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

  const photos = await listActivePhotos();
  let bookings: Booking[] = [];
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
