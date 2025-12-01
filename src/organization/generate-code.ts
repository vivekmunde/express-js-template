import { prisma } from '@/prisma';
import getRandomCharacter from '@/utils/get-random-character';

async function _generateOrganizationCode(name: string, addRandomCode: boolean) {
  const nameBasedCode = name
    .replace(/\s/gi, '-')
    .replace(/[^a-z0-9]/gi, '-')
    .slice(0, 24)
    .toLowerCase()
    .split('-')
    .filter((it) => it.length > 0)
    .join('-');

  const code = addRandomCode
    ? [
        nameBasedCode,
        Array.from({ length: 3 })
          .map(() => getRandomCharacter())
          .join(''),
      ].join('-')
    : nameBasedCode;

  const existingOrganizationWithSameCode = await prisma.organization.findFirst({
    where: { code },
  });

  if (existingOrganizationWithSameCode?.id) {
    return _generateOrganizationCode(name, true);
  }

  return code;
}

async function generateOrganizationCode(name: string) {
  return _generateOrganizationCode(name, false);
}

export { generateOrganizationCode };
