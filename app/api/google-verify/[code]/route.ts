import { GOOGLE_SITE_VERIFICATION } from "@/lib/google-verification";

type Context = { params: Promise<{ code: string }> };

export async function GET(_request: Request, context: Context) {
  const { code } = await context.params;
  const token = GOOGLE_SITE_VERIFICATION.trim();
  if (!token || code !== token) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(`google-site-verification: ${token}`, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
