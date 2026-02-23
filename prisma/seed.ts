import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roleNames = ['ADMIN', 'MANAGER', 'LEAD', 'INSPECTOR', 'TECH'];
  for (const name of roleNames) {
    await prisma.role.upsert({ where: { name }, create: { name }, update: {} });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@terrascape.local' },
    create: {
      email: 'admin@terrascape.local',
      fullName: 'Terra Admin',
      passwordHash,
      roleId: adminRole.id
    },
    update: {}
  });

  await prisma.notificationSetting.upsert({
    where: { userId: admin.id },
    create: { userId: admin.id, emailEnabled: true, smsEnabled: false, redAlertOnly: true },
    update: {}
  });
}

main().finally(async () => prisma.$disconnect());
