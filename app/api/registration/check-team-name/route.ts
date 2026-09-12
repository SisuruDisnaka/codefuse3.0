import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Lightweight in-memory rate limiting, mirroring the main registration
// route, so this can't be hammered to enumerate/spam the database.
const requestsByIp = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestsByIp.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  requestsByIp.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { available: null, message: "Too many checks. Please slow down." },
      { status: 429 }
    );
  }

  const name = (req.nextUrl.searchParams.get("name") ?? "").trim();
  if (name.length < 3) {
    // Mirrors the min-length rule in lib/validations/registration.ts —
    // nothing to check yet.
    return NextResponse.json({ available: null });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("teams")
      .select("id")
      .ilike("team_name", name)
      .limit(1);

    if (error) {
      console.error("Team name check error:", error.message);
      // Fail open: don't block the user from continuing just because
      // the availability check itself failed. The DB unique constraint
      // and register_team() RPC still enforce uniqueness at submit time.
      return NextResponse.json({ available: null });
    }

    return NextResponse.json({ available: (data?.length ?? 0) === 0 });
  } catch (err) {
    console.error("Team name check failed:", err);
    return NextResponse.json({ available: null });
  }
}
