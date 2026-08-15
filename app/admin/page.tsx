import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { isBlobStorageEnabled } from "@/lib/blob-env";
import { listActivePhotos } from "@/lib/photos";
import { AdminDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const photos = await listActivePhotos();

  return (
    <AdminDashboard
      initialPhotos={photos}
      useBlob={isBlobStorageEnabled()}
      onVercel={Boolean(process.env.VERCEL)}
    />
  );
}
