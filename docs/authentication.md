# Authentication & Authorization

This document covers the authentication system and Role-Based Access Control (RBAC) implementation in express-js-template.

## Table of Contents

- [Authentication System](#authentication-system)
- [RBAC System](#rbac-system)
- [Session Management](#session-management)
- [Permission Types](#permission-types)
- [User Categories](#user-categories)
- [Organization Context](#organization-context)

## Authentication System

The application uses a secure email + OTP authentication flow with encrypted cookie-based sessions.

### Authentication Flow

1. **Email Verification**
   - User submits email via `POST /:lng/auth/verify-email`
   - System validates email format and existence
   - Creates temporary login session with unique token

2. **OTP Generation**
   - System generates 4-digit numeric OTP
   - OTP is stored securely with expiration time
   - OTP sent to user's email address

3. **OTP Verification**
   - User submits OTP via `POST /:lng/auth/verify-otp`
   - System validates OTP and checks expiration
   - Creates encrypted user session upon success

4. **Session Creation**
   - Encrypted session cookie set with user information
   - Session includes user ID, permissions, and expiration
   - Cookie configured with security flags (httpOnly, secure, sameSite)

5. **Authenticated Requests**
   - All protected routes require valid session cookie
   - Session automatically refreshed on each request
   - Invalid sessions redirected to authentication

6. **Session Termination**
   - User can logout via `POST /:lng/auth/logout`
   - Destroys both user session and login session cookies
   - Clears all authentication state

### OTP Management

- **OTP Length**: 4-digit numeric code
- **Expiration**: Configurable via `USER_LOGIN_SESSION_COOKIE_MAX_AGE`
- **Resend Cooldown**: 30-second minimum between resend requests
- **Security**: OTPs are hashed before storage

### Session Security

- **Encryption**: Sessions encrypted using `ENCRYPTION_KEY`
- **Rotation**: Session tokens rotated on each request
- **Expiration**: Configurable session lifetime
- **Cleanup**: Expired sessions automatically removed

## RBAC System

The application implements a comprehensive two-tier Role-Based Access Control system supporting both system-wide and organization-specific permissions.

### System Architecture

```
User
├── System Roles (rbacGlobalRoleIds[])
│   └── Global permissions across platform
└── Organization Roles (rbacOrganizations[])
    └── Per-organization permission sets
```

### Two-Tier Model

#### System Level

- **Scope**: Platform-wide operations
- **Storage**: `user.rbacGlobalRoleIds`
- **Use Cases**:
  - Platform administration
  - Global user management
  - System configuration
  - Cross-organization operations

#### Organization Level

- **Scope**: Tenant-specific operations
- **Storage**: `user.rbacOrganizations` (array of organization-role mappings)
- **Use Cases**:
  - Multi-tenancy support
  - Organization-specific user management
  - Isolated permission management
  - Tenant customization

### Permission Types

| Permission            | Description                          | Scope               |
| --------------------- | ------------------------------------ | ------------------- |
| `READ_ERROR`          | View error logs                      | System              |
| `READ_ORGANIZATION`   | View organizations                   | System/Organization |
| `MANAGE_ORGANIZATION` | Create, update, delete organizations | System              |
| `READ_ROLE`           | View roles                           | System/Organization |
| `MANAGE_ROLE`         | Create, update, delete roles         | System/Organization |
| `READ_USER`           | View users                           | System/Organization |
| `MANAGE_USER`         | Create, update, delete users         | System/Organization |

### Permission Hierarchy

#### Authority Validation

- Users can only manage roles and permissions within their authority level
- Role assignments validated against actor's permissions
- Organization permissions isolated per tenant
- System permissions override organization permissions where applicable

#### Role Management Rules

1. **System Roles**: Can only be managed by users with system-level `MANAGE_ROLE` permission
2. **Organization Roles**: Can be managed by users with organization-level `MANAGE_ROLE` permission within that organization
3. **Permission Inheritance**: System-level permissions apply across all organizations
4. **Isolation**: Organization permissions don't cross tenant boundaries

### User Categories

#### SYSTEM Users

- **Access**: Global platform access
- **Permissions**: System-level roles only
- **Use Cases**: Platform administrators, system operators
- **Creation**: Requires system-level `MANAGE_USER` permission

#### ORGANIZATION Users

- **Access**: Organization-specific access
- **Permissions**: Organization-level roles within assigned organizations
- **Use Cases**: Tenant users, organization administrators
- **Creation**: Requires organization-level `MANAGE_USER` permission

## Session Management

### Cookie Configuration

#### User Login Session (OTP)

- **Name**: Configurable via `USER_LOGIN_SESSION_COOKIE_NAME`
- **Lifetime**: Configurable via `USER_LOGIN_SESSION_COOKIE_MAX_AGE`
- **Purpose**: Temporary session during OTP verification
- **Security**: Encrypted, httpOnly, secure flags

#### User Session (Authenticated)

- **Name**: Configurable via `USER_SESSION_COOKIE_NAME`
- **Lifetime**: Configurable via `USER_SESSION_COOKIE_MAX_AGE`
- **Purpose**: Long-term authenticated session
- **Security**: Encrypted, httpOnly, secure flags

### Session Lifecycle

1. **Creation**: After successful OTP verification
2. **Validation**: On each protected route access
3. **Refresh**: Automatic token rotation and expiration extension
4. **Destruction**: On logout or security events
5. **Cleanup**: Automatic removal of expired sessions

### Security Features

- **Encryption**: All session data encrypted at rest
- **Token Rotation**: Session tokens rotated regularly
- **Expiration**: Configurable session timeouts
- **Validation**: Strict session validation on each request
- **Cleanup**: Automatic cleanup of expired sessions

## Authorization Flow

### Request Authorization Process

1. **Session Validation**
   - Extract session cookie from request
   - Decrypt and validate session data
   - Verify session expiration and user existence

2. **Permission Resolution**
   - Load user's system-level roles and permissions
   - Load organization-specific roles (if applicable)
   - Merge permissions based on request context

3. **Authorization Check**
   - Match required permissions against user permissions
   - Validate organization context (for organization routes)
   - Check permission hierarchy and authority levels

4. **Access Decision**
   - Grant access if permissions match
   - Return 403 Forbidden if insufficient permissions
   - Return 401 Unauthorized if not authenticated

### Route Protection Levels

#### Public Routes

- **Pattern**: `/:lng/auth/*`
- **Access**: No authentication required
- **Examples**: Login, OTP verification, session status

#### Protected Routes

- **Pattern**: `/:lng/me/*`
- **Access**: Authentication required
- **Authorization**: Basic user permissions

#### System Protected Routes

- **Pattern**: `/:lng/system/*`
- **Access**: System-level permissions required
- **Authorization**: Global RBAC permissions

#### Organization Protected Routes

- **Pattern**: `/:lng/:organizationId/*`
- **Access**: Organization-level permissions required
- **Authorization**: Organization-specific RBAC permissions

## Organization Context

### Multi-Tenancy Support

The RBAC system fully supports multi-tenant architectures:

- **Isolation**: Organization data completely isolated
- **Permissions**: Organization-specific permission sets
- **Roles**: Custom roles per organization
- **Users**: Users can belong to multiple organizations with different roles

### Organization Switching

Users can switch between organizations they have access to:

1. **Context Endpoint**: `GET /:lng/me/logged-in-organization/:organizationCode`
2. **Permission Check**: Verify user has access to target organization
3. **Context Switch**: Update session with new organization context
4. **Permission Refresh**: Reload permissions for new context

### Permission Resolution in Organization Context

When accessing organization-specific routes:

1. **Organization Validation**: Verify organization exists and user has access
2. **Role Loading**: Load user's roles within that organization
3. **Permission Calculation**: Calculate effective permissions for organization
4. **Authority Check**: Validate user authority for requested operation

## Security Considerations

### Session Security

- Sessions encrypted with strong encryption keys
- Secure cookie flags prevent XSS attacks
- Session rotation prevents fixation attacks
- Automatic cleanup prevents session accumulation

### Permission Security

- Permission checks on every request
- Authority validation prevents privilege escalation
- Organization isolation prevents cross-tenant access
- Role hierarchy prevents unauthorized role management

### Best Practices

1. Use environment variables for sensitive configuration
2. Regularly rotate encryption keys
3. Monitor failed authentication attempts
4. Implement proper session timeouts
5. Log security events for audit trails
6. Validate organization context on all requests
7. Use least privilege principle for role assignments

## Error Handling

### Authentication Errors

- `INVALID_OTP`: Invalid or expired OTP
- `INVALID_TOKEN`: Invalid authentication token
- `SESSION_EXPIRED`: User session expired
- `TOO_EARLY_TO_RESEND_OTP`: OTP resend cooldown active

### Authorization Errors

- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Insufficient permissions
- `USER_DOES_NOT_EXIST`: User account not found
- `ORGANIZATION_ACCESS_DENIED`: No access to organization

All errors include localized messages based on the request language.
