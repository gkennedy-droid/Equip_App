import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const TOKEN_NAME = 'terra_session';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export type SessionPayload = {
  sub: string;
  role: string;
  email: string;
  name: string;
};

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);
}

export async function getSession() {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;
  try {
    const result = await jwtVerify(token, secret);
    return result.payload as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  cookies().delete(TOKEN_NAME);
}

export function setSessionCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}
