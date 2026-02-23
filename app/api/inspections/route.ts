import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/guards';

export async function POST(req: Request) {
  const auth = await requireRole(['ADMIN', 'MANAGER', 'LEAD', 'INSPECTOR']);
  if (auth.error || !auth.session) return auth.error;

  const form = await req.formData();
  const status = String(form.get('status')) as 'GREEN' | 'YELLOW' | 'RED';

  await prisma.$transaction(async (tx) => {
    const inspection = await tx.inspection.create({
      data: {
        equipmentId: String(form.get('equipmentId')),
        templateId: String(form.get('templateId') || '') || null,
        status,
        inspectorId: auth.session!.sub,
        notes: String(form.get('notes') || '')
      }
    });

    if (status === 'RED') {
      await tx.workOrder.create({
        data: {
          inspectionId: inspection.id,
          summary: `Auto-created from RED inspection for equipment ${String(form.get('equipmentId'))}`
        }
      });
    }
  });

  return NextResponse.redirect(new URL('/dashboard', req.url));
}
