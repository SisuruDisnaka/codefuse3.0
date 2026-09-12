import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/registration";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { eventConfig } from "@/data/event";
import type { RegistrationResponse } from "@/types/registration";

// Minimal in-memory rate limiting (per server instance). For serious
// abuse protection, front this route with a platform-level limiter.
const submissionsByIp = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    const body: RegistrationResponse = {
      success: false,
      message: "Too many attempts. Please wait a moment and try again.",
    };
    return NextResponse.json(body, { status: 429 });
  }

  if (eventConfig.registrationStatus !== "OPEN") {
    const body: RegistrationResponse = {
      success: false,
      message: "The web is currently sealed. Registration is not open.",
    };
    return NextResponse.json(body, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    const body: RegistrationResponse = {
      success: false,
      message: "Invalid request body.",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".") || "form"] = issue.message;
    }
    const body: RegistrationResponse = {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
    return NextResponse.json(body, { status: 422 });
  }

  const data = parsed.data;

  try {
    const supabase = createServiceRoleClient();

    const { data: rpcData, error } = await supabase.rpc("register_team", {
      p_team_name: data.teamName,
      p_team_size: data.teamSize,
      p_team_email: data.teamEmail,
      p_team_whatsapp: data.teamWhatsapp,
      p_hackerrank_team_name: data.hackerrankTeamName,
      p_github_url: data.githubUrl || null,
      p_additional_information: data.additionalInformation || null,
      p_members: data.members.map((m) => ({
        member_number: m.memberNumber,
        full_name: m.fullName,
        registration_number: m.registrationNumber,
        email: m.email,
        whatsapp_number: m.whatsappNumber,
      })),
    });

    if (error) {
      if (error.message.includes("TEAM_NAME_EXISTS")) {
        const body: RegistrationResponse = {
          success: false,
          message: "This group name has already entered the web.",
          fieldErrors: { teamName: "This group name is already taken." },
        };
        return NextResponse.json(body, { status: 409 });
      }
      console.error("Registration RPC error:", error.message);
      const body: RegistrationResponse = {
        success: false,
        message: "Something went wrong while entering the web. Please try again.",
      };
      return NextResponse.json(body, { status: 500 });
    }

    const registrationCode = rpcData?.[0]?.registration_code as string;
    const body: RegistrationResponse = {
      success: true,
      registrationCode,
    };
    return NextResponse.json(body, { status: 201 });
  } catch (err) {
    console.error("Registration failed:", err);
    const body: RegistrationResponse = {
      success: false,
      message: "Something went wrong while entering the web. Please try again.",
    };
    return NextResponse.json(body, { status: 500 });
  }
}
