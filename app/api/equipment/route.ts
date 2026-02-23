import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/guards';

export async function POST(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER', 'LEAD']);
  if (auth.error) return auth.error;

  const form = await req.formData();
  await prisma.equipment.create({
    data: {
      assetTag: String(form.get('assetTag')),
      name: String(form.get('name')),
      model: String(form.get('model')),
      serialNumber: String(form.get('serialNumber') || ''),
      location: String(form.get('location'))
    }
  });

  return NextResponse.redirect(new URL('/dashboard', req.url));
}
