import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { Organization, Prisma, Role, User } from '@prisma/client';
import { Request, Response } from 'express';

const ifExists = async <T extends { id: string }>(
  req: Request,
  res: Response,
  check: () => Promise<T | null>,
  fn: (model: T) => Promise<Response>
) => {
  const record = await check();

  if (record?.id) {
    return fn(record);
  }

  return res.status(STATUS_CODES.NOT_FOUND).json({});
};

const ifOrganizationExists = async (
  req: Request,
  res: Response,
  where: Prisma.OrganizationWhereInput,
  fn: (model: Organization) => Promise<Response>
) => {
  return ifExists<Organization>(req, res, () => prisma.organization.findFirst({ where }), fn);
};

const ifRoleExists = async (
  req: Request,
  res: Response,
  where: Prisma.RoleWhereInput,
  fn: (model: Role) => Promise<Response>
) => {
  return ifExists<Role>(req, res, () => prisma.role.findFirst({ where }), fn);
};

const ifUserExists = async (
  req: Request,
  res: Response,
  where: Prisma.UserWhereInput,
  fn: (model: User) => Promise<Response>
) => {
  return ifExists<User>(req, res, () => prisma.user.findFirst({ where }), fn);
};

export { ifExists, ifOrganizationExists, ifRoleExists, ifUserExists };
