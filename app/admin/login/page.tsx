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
      <p className="reveal mb-10 text-[11px] tracking-[0.28em] text-cream/55">
        eyes.on.batumi
      </p>
      <h1 className="reveal reveal-delay mb-10 font-serif text-2xl">ადმინის შესვლა</h1>
      <div className="reveal reveal-delay-2 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
