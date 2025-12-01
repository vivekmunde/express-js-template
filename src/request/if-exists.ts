import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import {
  Document,
  DocumentComment,
  DocumentSection,
  DocumentStatus,
  DocumentType,
  Organization,
  Prisma,
  Project,
  Role,
  User,
} from '@prisma/client';
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

const ifProjectExists = async (
  req: Request,
  res: Response,
  where: Prisma.ProjectWhereInput,
  fn: (model: Project) => Promise<Response>
) => {
  return ifExists<Project>(req, res, () => prisma.project.findFirst({ where }), fn);
};

const ifDocumentTypeExists = async (
  req: Request,
  res: Response,
  where: Prisma.DocumentTypeWhereInput,
  fn: (model: DocumentType) => Promise<Response>
) => {
  return ifExists<DocumentType>(req, res, () => prisma.documentType.findFirst({ where }), fn);
};

const ifDocumentStatusExists = async (
  req: Request,
  res: Response,
  where: Prisma.DocumentStatusWhereInput,
  fn: (model: DocumentStatus) => Promise<Response>
) => {
  return ifExists<DocumentStatus>(req, res, () => prisma.documentStatus.findFirst({ where }), fn);
};

const ifDocumentSectionExists = async (
  req: Request,
  res: Response,
  where: Prisma.DocumentSectionWhereInput,
  fn: (model: DocumentSection) => Promise<Response>
) => {
  return ifExists<DocumentSection>(req, res, () => prisma.documentSection.findFirst({ where }), fn);
};

const ifDocumentCommentExists = async (
  req: Request,
  res: Response,
  where: Prisma.DocumentCommentWhereInput,
  fn: (model: DocumentComment) => Promise<Response>
) => {
  return ifExists<DocumentComment>(req, res, () => prisma.documentComment.findFirst({ where }), fn);
};

const ifDocumentExists = async (
  req: Request,
  res: Response,
  where: Prisma.DocumentWhereInput,
  fn: (model: Document) => Promise<Response>
) => {
  return ifExists<Document>(req, res, () => prisma.document.findFirst({ where }), fn);
};

export {
  ifDocumentCommentExists,
  ifDocumentExists,
  ifDocumentSectionExists,
  ifDocumentStatusExists,
  ifDocumentTypeExists,
  ifExists,
  ifOrganizationExists,
  ifProjectExists,
  ifRoleExists,
  ifUserExists,
};
