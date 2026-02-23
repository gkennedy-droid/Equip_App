import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/guards';

export async function POST(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER', 'LEAD']);
  if (auth.error) return auth.error;

  const form = await req.formData();
  const items = String(form.get('items') || '').split(',').map((v) => v.trim()).filter(Boolean);

  await prisma.template.create({
    data: {
      name: String(form.get('name')),
      description: String(form.get('description') || ''),
      items: {
        create: items.map((label) => ({ label }))
      }
    }
  });

  return NextResponse.redirect(new URL('/dashboard', req.url));
}

export async function DELETE(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER']);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER', 'LEAD']);
  if (auth.error) return auth.error;

  const body = await req.json();
  const id = String(body.id || '');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.template.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description
    }
  });

  return NextResponse.json({ ok: true });
}
