import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "@/lib/service";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;
  const parsed = await decrypt(session);
  if (typeof parsed === "object" && parsed !== null) {
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
