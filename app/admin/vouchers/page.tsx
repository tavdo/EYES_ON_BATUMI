import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { siteUrl } from "@/lib/site-url";
import { listVouchers, nextVoucherCode } from "@/lib/vouchers";
import { VoucherStudio } from "./studio";

export const dynamic = "force-dynamic";

export default async function AdminVouchersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let vouchers: Awaited<ReturnType<typeof listVouchers>> = [];
  let initialCode = "EOB-DV-001";

  try {
    vouchers = await listVouchers();
    initialCode = await nextVoucherCode();
  } catch {
    vouchers = [];
  }

  return (
    <VoucherStudio
      initialCode={initialCode}
      initialVouchers={vouchers}
      origin={siteUrl()}
    />
  );
}
