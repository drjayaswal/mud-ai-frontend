import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "@/lib/service";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;
  const parsed = await decrypt(session);
  // Type guard: ensure parsed is an object
  if (typeof parsed === "object" && parsed !== null) {
    // Cast to Record<string, unknown> for type safety
    const parsedObj = parsed as Record<string, unknown>;
    parsedObj.expires = new Date(Date.now() + 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(parsedObj),
      httpOnly: true,
      expires: parsedObj.expires as Date,
    });
    return res;
  }
}
