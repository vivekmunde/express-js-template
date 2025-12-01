import { PrismaClient } from '@prisma/client';
import { consoleLog } from './log.mts';

const prisma = new PrismaClient();

async function clean() {
  consoleLog('Setup DB: Clean Started!');

  await prisma.apiErrorLog.deleteMany();
  await prisma.uiErrorLog.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.organizationChangeLog.deleteMany();
  await prisma.role.deleteMany();
  await prisma.roleChangeLog.deleteMany();
  await prisma.userLoginSession.deleteMany();
  await prisma.userLoginSessionChangeLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userChangeLog.deleteMany();

  consoleLog('Setup DB: Clean Completed!');
}

clean()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
