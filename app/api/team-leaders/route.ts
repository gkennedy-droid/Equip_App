import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/guards';

export async function POST(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER']);
  if (auth.error) return auth.error;

  const form = await req.formData();
  await prisma.teamLeader.create({
    data: {
      userId: String(form.get('userId')),
      equipmentId: String(form.get('equipmentId'))
    }
  });
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
