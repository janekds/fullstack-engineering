import { NextRequest, NextResponse } from "next/server";
import { sendJobApplicationConfirmation } from "@/lib/resend";

export const runtime = "nodejs";        // ensure Node runtime
export const dynamic = "force-dynamic"; // don't cache this route

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "").trim();
    const name = String(body?.name ?? "there");
    const jobTitle = String(body?.jobTitle ?? "your application");
    const company = String(body?.company ?? "the employer");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sendJobApplicationConfirmation(email, name, jobTitle, company);

    if (!result?.success) {
      console.error("Resend send failed:", result?.error);
      return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error in send-job-application-confirmation route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
