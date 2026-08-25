import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";

const ADMIN_ACCOUNT_ID = "singleton";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminAccount(): Promise<{
  firstName: string;
  lastName: string;
  username: string;
  passwordHash: string;
}> {
  const account = await prisma.adminAccount.findUnique({ where: { id: ADMIN_ACCOUNT_ID } });
  if (!account) {
    throw new Error("Admin account is not set up — complete setup at /setup.");
  }
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    username: account.username,
    passwordHash: account.passwordHash,
  };
}

export async function updateAdminPassword(newHash: string): Promise<void> {
  await prisma.adminAccount.update({
    where: { id: ADMIN_ACCOUNT_ID },
    data: { passwordHash: newHash },
  });
}

export async function updateAdminProfile(data: { firstName: string; lastName: string; username: string }): Promise<void> {
  await prisma.adminAccount.update({
    where: { id: ADMIN_ACCOUNT_ID },
    data,
  });
}
