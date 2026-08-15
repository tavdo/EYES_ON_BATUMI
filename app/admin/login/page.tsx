import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <p className="mb-10 text-[11px] tracking-[0.28em] text-cream/55">
        eyes.on.batumi
      </p>
      <h1 className="mb-10 font-serif text-2xl">ადმინის შესვლა</h1>
      <LoginForm />
    </main>
  );
}
