import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isBookingStatus, setBookingStatus } from "@/lib/bookings";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  const { id } = await context.params;
  let status = "";
  try {
    const body = (await request.json()) as { status?: string };
    status = typeof body.status === "string" ? body.status : "";
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  if (!isBookingStatus(status)) {
    return NextResponse.json({ error: "არასწორი სტატუსი" }, { status: 400 });
  }

  const updated = await setBookingStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "ჯავშანი ვერ მოიძებნა" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, status });
}
