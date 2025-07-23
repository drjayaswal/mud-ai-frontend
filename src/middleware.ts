/**
 * Middleware for session management and automatic session expiration refresh.
 *
 * NOTE: If your backend (where session tokens are issued/verified) is on Render
 * and your frontend (Next.js) is on Vercel, you must ensure that cookies are set
 * with the correct domain and security settings so that both frontend and backend
 * can read/write the session cookie.
 *
 * - If your frontend and backend are on different domains (e.g., frontend.com, backend.com),
 *   httpOnly cookies set by the backend will NOT be accessible to the frontend (and vice versa).
 * - For cross-domain authentication, consider using JWTs in Authorization headers, or
 *   set cookies with `domain` as the parent domain (if possible), and use CORS with credentials.
 * - If you use cookies, set `sameSite: "none"` and `secure: true` for cross-site cookies.
 * - If you only need session on the frontend (Next.js), you can manage the session cookie here.
 *
 * This middleware assumes the session cookie is accessible to the frontend.
 */

import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "@/lib/service";

/**
 * Middleware function to handle session sliding expiration.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<NextResponse | void>} - The response with refreshed session cookie, or void if no session.
 */
export async function middleware(
  request: NextRequest
): Promise<NextResponse | void> {
  // Retrieve the session cookie from the request
  const sessionToken = request.cookies.get("session")?.value;

  // If no session cookie is present, allow the request to proceed
  if (!sessionToken) {
    return;
  }

  try {
    // Attempt to decrypt the session token
    const sessionData = await decrypt(sessionToken);

    // Ensure the decrypted session is a valid object
    if (typeof sessionData === "object" && sessionData !== null) {
      // Clone the session object to avoid mutating the original
      const updatedSession = { ...sessionData } as Record<string, unknown>;

      // Set the new expiration time to 1 minute from now (sliding expiration)
      const newExpiry = new Date(Date.now() + 60 * 60 * 1000);
      updatedSession.expires = newExpiry;

      // Encrypt the updated session object
      const newSessionToken = await encrypt(updatedSession);

      // Prepare the response and set the refreshed session cookie
      const response = NextResponse.next();
      response.cookies.set({
        name: "session",
        value: newSessionToken,
        httpOnly: true,
        expires: newExpiry,
        path: "/", // Ensure cookie is available to all routes
        // If your frontend and backend are on different domains, you may need:
        // sameSite: "none", secure: true, and possibly set the domain explicitly.
        sameSite:
          process.env.FRONTEND_BACKEND_CROSS_DOMAIN === "true" ? "none" : "lax",
        secure: true, // Required for sameSite: "none"
        // domain: ".yourdomain.com", // Uncomment and set if you have a shared parent domain
      });

      return response;
    }
  } catch {
    // If decryption fails, treat as no session (do not throw)
    // Optionally, you could clear the session cookie here
    // Example:
    // const response = NextResponse.next();
    // response.cookies.set("session", "", { expires: new Date(0) });
    // return response;
    return;
  }
}
