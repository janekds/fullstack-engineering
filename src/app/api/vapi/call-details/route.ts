import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { vapiCallId } = await request.json();
    console.log("vapiCallId", vapiCallId);
    let callId: string | null = null;

    if (!vapiCallId) {
      return NextResponse.json(
        { error: "No vapi call id provided" },
        { status: 401 }
      );
    }

    // Step 2: Fetch call details from Vapi
    const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY || "";
    if (!VAPI_API_KEY) {
      return NextResponse.json(
        { error: "Missing Vapi API key on server" },
        { status: 500 }
      );
    }

    const vapiRes = await fetch(
      `https://api.vapi.ai/call/${encodeURIComponent(vapiCallId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${VAPI_API_KEY}`,
        },
        // Avoid caching to always show latest
        cache: "no-store",
      }
    );

    if (!vapiRes.ok) {
      const text = await vapiRes.text();
      return NextResponse.json(
        { error: "Failed to fetch Vapi call details", details: text },
        { status: 502 }
      );
    }

    const vapiData = await vapiRes.json();
    const response = {
      analysis: vapiData.analysis,
      messages: vapiData.messages,
      createdAt: vapiData.createdAt,
      id: vapiData.id,
      status: vapiData.status,
      stereoRecordingUrl: vapiData.stereoRecordingUrl,
      startedAt: vapiData.startedAt,
      endedAt: vapiData.endedAt,
    };
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Error in /api/vapi/call-details:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
