import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getAnalyticsSummary(7);
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
