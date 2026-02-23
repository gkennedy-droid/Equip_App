import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const redInspections = await prisma.inspection.findMany({
    where: { status: 'RED' },
    include: { equipment: true, inspector: true },
    take: 100,
    orderBy: { createdAt: 'desc' }
  });

  const users = await prisma.notificationSetting.findMany({
    where: { emailEnabled: true, redAlertOnly: true },
    include: { user: true }
  });

  return NextResponse.json({
    queued: redInspections.length * users.length,
    message: 'Cron endpoint scanned red inspections and eligible notification recipients.'
  });
}
