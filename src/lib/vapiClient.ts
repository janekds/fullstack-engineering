"use client";
import Vapi from "@vapi-ai/web";

let client: any | null = null;

export function getVapiClient() {
  if (typeof window === "undefined") return null;
  if (!client) {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY");
    client = new Vapi(key);
  }
  return client;
}

export async function startVapiCall(assistantId: string, opts?: any) {
  const vapi = getVapiClient();
  if (!vapi) throw new Error("Vapi client unavailable");
  return vapi.start(assistantId, opts);
}

export async function stopVapiCall() {
  const vapi = getVapiClient();
  if (!vapi?.stop) return;
  await vapi.stop();
}