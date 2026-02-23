import { NextResponse } from 'next/server';
import { getSession } from './auth';

export async function requireRole(allowedRoles: string[]) {
  const session = await getSession();
  if (!session) return { error: NextResponse.redirect(new URL('/login', process.env.APP_URL || 'http://localhost:3000')) };
  if (!allowedRoles.includes(session.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}
