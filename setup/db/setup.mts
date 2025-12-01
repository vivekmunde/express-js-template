import { PrismaClient } from '@prisma/client';
import { assignRoles } from './assign-roles.mts';
import { createRoles } from './create-roles.mts';
import { createUsers } from './create-users.mts';
import { consoleLog } from './log.mts';

const prisma = new PrismaClient();

async function main() {
  consoleLog('================================================================');
  consoleLog('Setup DB: Started!');
  consoleLog('================================================================');

  await createUsers(prisma);
  await createRoles(prisma);
  await assignRoles(prisma);

  consoleLog('================================================================');
  consoleLog('Setup DB: Completed!');
  consoleLog('================================================================');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
