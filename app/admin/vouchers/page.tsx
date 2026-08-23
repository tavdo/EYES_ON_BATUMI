import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listActivePhotos } from "@/lib/photos";
import { listVouchers, nextVoucherCode } from "@/lib/vouchers";
import { VoucherStudio } from "./studio";

export const dynamic = "force-dynamic";

export default async function AdminVouchersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let photos: string[] = [];
  let vouchers: Awaited<ReturnType<typeof listVouchers>> = [];
  let initialCode = "EOB-DV-001";

  try {
    const items = await listActivePhotos();
    photos = items.slice(0, 12).map((photo) => `/api/photos/${photo.id}/preview`);
  } catch {
    photos = [];
  }
  try {
    vouchers = await listVouchers();
    initialCode = await nextVoucherCode();
  } catch {
    vouchers = [];
  }

  return (
    <VoucherStudio initialCode={initialCode} initialVouchers={vouchers} photos={photos} />
  );
}
