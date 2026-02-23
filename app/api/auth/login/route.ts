import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { setSessionCookie, signSession } from '@/lib/auth';

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') || '').toLowerCase();
  const password = String(form.get('password') || '');
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const token = await signSession({
    sub: user.id,
    role: user.role.name,
    email: user.email,
    name: user.fullName
  });

  setSessionCookie(token);
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
