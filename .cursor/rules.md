# Cursor AI Rules

## Architecture Overview

This is an Express.js REST API server built with TypeScript, MongoDB (Prisma ORM), featuring:

- Multi-tenant organization support
- Two-tier RBAC (System and Organization levels)
- Cookie-based authentication with OTP verification
- Internationalization (i18next) with English and Dutch
- Comprehensive audit trails via change logs
- Analytics tracking system

## Project Structure

```
src/
├── auth/              # Authentication modules (user-session, user-login-session)
├── routes/            # API endpoints organized by domain
│   ├── auth/          # Authentication routes
│   ├── system/        # System-level admin routes
│   ├── [organizationId]/  # Organization-scoped routes
│   ├── me/            # Current user routes
│   └── analytics/     # Analytics tracking
├── route-handlers/    # Route handler wrappers
├── middlewares/       # Express middlewares
├── services/          # Business logic
│   ├── rbac/          # RBAC authorization services
│   └── change-log/    # Audit trail services
├── request/           # Request validation helpers
├── response/          # Response formatting helpers
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Patterns & Conventions

### Route Structure

1. **All routes must be prefixed with `/:lng`** for internationalization
2. **Route organization**:
   - Public routes: `/:lng/auth/*`, `/:lng/heart-beat/*`
   - Protected routes: Use appropriate route handler wrapper
   - System routes: `/:lng/system/*` (require system-level permissions)
   - Organization routes: `/:lng/[organizationId]/*` (require organization-level permissions)
   - User routes: `/:lng/me/*` (current user operations)

3. **Route file structure**:

   ```typescript
   // routes/system/users/index.ts
   import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
   import { Router } from 'express';
   import { GET } from './get';
   import { POST } from './post';

   const systemUsersRoutes = Router();
   systemUsersRoutes.get('/system/users', protectedSystemRouteHandler(GET, ['READ_USER']));
   systemUsersRoutes.post('/system/users', protectedSystemRouteHandler(POST, ['MANAGE_USER']));
   export { systemUsersRoutes };
   ```

### Route Handlers

Use the appropriate route handler wrapper:

1. **`routeHandler`**: Basic async error handling wrapper
2. **`protectedRouteHandler`**: Requires authenticated user (sets `req.sessionUser`)
3. **`protectedSystemRouteHandler(fn, permissions[])`**: Requires system-level permissions
4. **`protectedOrganizationRouteHandler(fn, permissions[])`**: Requires organization-level permissions

**Example**:

```typescript
const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  // context.sessionUser is guaranteed to exist
  // context.language is available for i18n
  return res.json({ data: ... });
};
```

### Request Validation

Always validate requests using Zod schemas:

1. **`ifValidValues`**: For validating arbitrary data
2. **`ifValidRequestValues`**: For validating `req.body` with Zod schema
3. **`ifValidListSearchParams`**: For list/search endpoints (pagination, sorting, filtering)

**Example**:

```typescript
return ifValidRequestValues(req, res, getCreateUserValidationSchema(req), async (data) => {
  // data is validated and typed
  return res.json({ data: ... });
});
```

### Response Format

Always use `TResponseBody<TModel, TErrorCode>`:

```typescript
const responseBody: TResponseBody<TGetUsersResponseData> = {
  data: {
    items: users,
    page: 1,
    size: 10,
    total: 100,
  },
};

// For errors
const responseBody: TResponseBody<undefined, 'USER_EXISTS'> = {
  error: {
    code: 'USER_EXISTS',
    message: req.t('USER_EXISTS', { ns: 'error-codes' }),
  },
};

// For validation errors
const responseBody: TResponseBody<TOutput> = {
  validationErrors: { field: 'error message' },
};
```

### Authorization

1. **System-level permissions**: Use `protectedSystemRouteHandler` with permission array
2. **Organization-level permissions**: Use `protectedOrganizationRouteHandler` with permission array
3. **Authority checks**: Use `ifAuthorized` helper for conditional authorization
4. **Available permissions**:
   - `READ_ERROR`, `READ_ORGANIZATION`, `MANAGE_ORGANIZATION`
   - `READ_ROLE`, `MANAGE_ROLE`
   - `READ_USER`, `MANAGE_USER`

**Example**:

```typescript
return ifAuthorized(
  req,
  res,
  () => isSystemActorAuthorizedToAssignRolesToNewUser(context.sessionUser.id, data.roleIds),
  async () => {
    // Authorized logic
  }
);
```

### Database Operations

1. **Always use Prisma client** from `@/prisma`
2. **Change logs**: Create change logs for all data modifications using services in `src/services/change-log/`
3. **Transaction safety**: Use Prisma transactions when needed
4. **Query optimization**: Use `Promise.all` for parallel queries

**Example**:

```typescript
const [usersData, totalUsers] = await Promise.all([
  prisma.user.findMany({ ... }),
  prisma.user.count({ ... }),
]);

// After creating/updating
await createUserChangeLog(createdUserData);
```

### Request Context

1. **`TPublicRequestContext`**: For public routes (optional `sessionUser`)
2. **`TProtectedRequestContext`**: For protected routes (required `sessionUser`, `language`)

Access via route handler context parameter:

```typescript
const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const userId = context.sessionUser.id;
  const language = context.language; // 'en' | 'nl'
};
```

### Internationalization

1. **Translation keys**: Use `req.t(key, { ns: 'error-codes' | 'validations' | 'emails' })`
2. **Translation files**: Located in `src/locales/{lng}/{ns}.json`
3. **Language detection**: Automatically handled via `/:lng` route prefix

**Example**:

```typescript
const message = req.t('USER_EXISTS', { ns: 'error-codes' });
```

### Error Handling

1. **Errors are caught** by `routeHandler` wrapper and passed to `errorHandlerMiddleware`
2. **API errors are logged** to `apiErrorLog` table automatically
3. **Return appropriate status codes** from `@/constants/status-codes`
4. **Custom errors**: Use `TResponseBody` with `error` field

**Example**:

```typescript
return res.status(STATUS_CODES.BAD_REQUEST).json({
  error: {
    code: 'USER_EXISTS',
    message: req.t('USER_EXISTS', { ns: 'error-codes' }),
  },
});
```

### Type Safety

1. **Always use TypeScript types** from `@/types/*`
2. **Request/Response interfaces**: Define in route's `interfaces.ts`
3. **Validation schemas**: Define in route's `validation-schema.ts`
4. **Use Prisma generated types**: `User`, `Role`, `Organization`, etc.

### Code Style

1. **Path aliases**: Use `@/*` for `src/*` imports
2. **File naming**:
   - Route handlers: `get.ts`, `post.ts`, `put.ts`, `patch.ts`, `delete.ts`
   - Route index: `index.ts`
   - Types: `interfaces.ts`, `validation-schema.ts`
3. **Exports**: Use named exports, not default exports
4. **Async/await**: Prefer async/await over promises
5. **Formatting**: Prettier handles formatting (run `yarn format`)

### Prisma Schema

1. **Modular schemas**: Schema files in `schema/` directory are aggregated
2. **Run `yarn prisma:generate`** after schema changes
3. **Change logs**: Every model has a corresponding `*ChangeLog` model
4. **Audit fields**: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `archivedAt`, `archivedBy`

### Testing & Development

1. **Environment variables**: All required in `src/env.ts`
2. **Development**: `yarn dev` runs full pipeline (generate, format, lint, tsc, watch)
3. **Database setup**: `yarn setup-db` or `yarn setup-clean-db`
4. **Docker**: Use `docker-compose up` for local development

### Security

1. **Authentication**: Cookie-based sessions (encrypted)
2. **Authorization**: Always check permissions via route handlers
3. **Input validation**: All inputs validated with Zod
4. **CORS**: Configured in `src/middlewares/cors.ts`
5. **Session management**: Handled in `src/auth/user-session.ts`

### Common Helpers

1. **`ifExists`**: Check if model exists before operation
2. **`ifAuthorized`**: Conditional authorization check
3. **`ifValidValues`**: Generic Zod validation
4. **`ifValidRequestValues`**: Request body validation
5. **`ifValidListSearchParams`**: List/search parameter validation

## Best Practices

1. **Always validate inputs** with Zod schemas
2. **Always create change logs** for data modifications
3. **Use appropriate route handlers** for authorization
4. **Return consistent response format** using `TResponseBody`
5. **Use i18n** for all user-facing messages
6. **Handle errors gracefully** with proper status codes
7. **Optimize queries** with parallel execution where possible
8. **Follow existing patterns** in similar routes
9. **Type everything** - avoid `any` types
10. **Keep routes focused** - one responsibility per route handler

## Common Mistakes to Avoid

1. ❌ Don't forget `/:lng` prefix in routes
2. ❌ Don't skip request validation
3. ❌ Don't forget change logs for data modifications
4. ❌ Don't use default exports
5. ❌ Don't bypass authorization checks
6. ❌ Don't hardcode error messages (use i18n)
7. ❌ Don't forget to handle async errors
8. ❌ Don't use `any` types
9. ❌ Don't forget to update Prisma client after schema changes
10. ❌ Don't create routes without proper route handler wrapper
