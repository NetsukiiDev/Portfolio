import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken, getAdminAccount } from "@/lib/auth";
import { isSecureRequest } from "@/lib/forwarded";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (typeof username !== "string" || !username || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const account = await getAdminAccount();
  const usernameMatch = username.toLowerCase() === account.username.toLowerCase();
  const passwordMatch = await bcrypt.compare(password, account.passwordHash);

  if (!usernameMatch || !passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken({ role: "admin" });

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-session", token, {
    httpOnly: true,
    sameSite: "lax",
    // Follows the scheme the browser is actually using, which behind a
    // tunnel is HTTPS even though this process only ever sees HTTP.
    secure: isSecureRequest(request),
    path: "/",
    maxAge: 86400,
  });
  return response;
}
