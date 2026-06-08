import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";

const sessionCookieName = "ocji_session";

type SessionPayload = {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a 32+ character value.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecret());

  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getAuthSecret());
    const payload = verified.payload as unknown as SessionPayload;

    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function verifyEditorLogin(email: string, password: string) {
  const prisma = getPrisma();

  if (!prisma) {
    throw new Error("DATABASE_URL is required for admin login.");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    sub: user.id,
    email: user.email,
    role: user.role,
  } satisfies SessionPayload;
}
