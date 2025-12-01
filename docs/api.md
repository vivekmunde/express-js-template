# API Documentation

This document provides comprehensive documentation for all API endpoints in the q-server application.

## Base URL Structure

All endpoints are prefixed with `/:lng` for internationalization support (e.g., `/en/` or `/nl/`).

**Format**: `/:lng/endpoint`
**Examples**: `/en/auth/session`, `/nl/me/profile`

## Analytics Routes

Public endpoints for tracking user behavior and application analytics.

| Method | Endpoint          | Description                   | Auth Required |
| ------ | ----------------- | ----------------------------- | ------------- |
| `POST` | `/:lng/analytics` | Record analytics event/action | No            |

### Analytics Event Tracking

Analytics events capture user interactions and application usage:

- **View Tracking**: Hierarchical view navigation (e.g., "dashboard.users.list")
- **Event Tracking**: User actions (click, submit, view, etc.)
- **Metadata Support**: Custom data attachment for events
- **Organization Context**: Optional organization-specific tracking
- **User Association**: Optional user attribution for authenticated events

#### Analytics Request Format

```json
{
  "view": "dashboard.users.list",
  "event": "view",
  "label": "User Management Page",
  "organizationId": "org123",
  "metadata": {
    "customField": "value",
    "filters": ["active", "admin"]
  }
}
```

## Authentication Routes

Public endpoints that don't require authentication.

| Method | Endpoint                   | Description                               | Auth Required |
| ------ | -------------------------- | ----------------------------------------- | ------------- |
| `POST` | `/:lng/auth/verify-email`  | Initiate authentication with email        | No            |
| `POST` | `/:lng/auth/verify-otp`    | Verify OTP and complete authentication    | No            |
| `POST` | `/:lng/auth/resend-otp`    | Resend OTP code                           | No            |
| `GET`  | `/:lng/auth/session`       | Get current authentication session status | No            |
| `POST` | `/:lng/auth/session/reset` | Reset/clear current login session         | No            |
| `POST` | `/:lng/auth/logout`        | Terminate user session and logout         | No            |

### Authentication Flow

1. **Step 1**: Submit email to `POST /:lng/auth/verify-email`
2. **Step 2**: System generates 4-digit OTP and sends to email
3. **Step 3**: Submit OTP to `POST /:lng/auth/verify-otp`
4. **Step 4**: Receive encrypted session cookie upon successful verification
5. **Step 5**: Use session cookie for all subsequent authenticated requests
6. **Step 6**: Terminate session via `POST /:lng/auth/logout` when done

## User Profile Routes (`/me`)

Endpoints for managing the current user's profile and preferences.

| Method | Endpoint                                                        | Description                                | Permissions   |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | ------------- |
| `GET`  | `/:lng/me`                                                      | Get current user profile                   | Authenticated |
| `PUT`  | `/:lng/me/name`                                                 | Update user name                           | Authenticated |
| `GET`  | `/:lng/me/organizations`                                        | Get user's organizations                   | Authenticated |
| `GET`  | `/:lng/me/organizations/:organizationId/accessible-roles`       | Get accessible roles in organization       | Authenticated |
| `GET`  | `/:lng/me/organizations/:organizationId/accessible-permissions` | Get accessible permissions in organization | Authenticated |
| `GET`  | `/:lng/me/logged-in-organization/:organizationCode`             | Switch organization context                | Authenticated |
| `PUT`  | `/:lng/me/preferences/language`                                 | Update language preference                 | Authenticated |
| `PUT`  | `/:lng/me/preferences/theme-mode`                               | Update theme mode preference               | Authenticated |
| `GET`  | `/:lng/me/system/accessible-roles`                              | Get accessible system roles                | Authenticated |
| `GET`  | `/:lng/me/system/accessible-permissions`                        | Get accessible system permissions          | Authenticated |

## System Management Routes (Global Permissions)

Administrative endpoints that require system-level permissions.

| Method   | Endpoint                                              | Description                           | Required Permission   |
| -------- | ----------------------------------------------------- | ------------------------------------- | --------------------- |
| `GET`    | `/:lng/system/users`                                  | List system users                     | `READ_USER`           |
| `POST`   | `/:lng/system/users`                                  | Create system user                    | `MANAGE_USER`         |
| `GET`    | `/:lng/system/users/:userId`                          | Get specific system user              | `READ_USER`           |
| `PUT`    | `/:lng/system/users/:userId`                          | Update system user                    | `MANAGE_USER`         |
| `GET`    | `/:lng/system/roles`                                  | List system roles                     | `READ_ROLE`           |
| `POST`   | `/:lng/system/roles`                                  | Create system role                    | `MANAGE_ROLE`         |
| `GET`    | `/:lng/system/roles/:roleId`                          | Get specific system role              | `READ_ROLE`           |
| `PUT`    | `/:lng/system/roles/:roleId`                          | Update system role                    | `MANAGE_ROLE`         |
| `DELETE` | `/:lng/system/roles/:roleId`                          | Delete system role                    | `MANAGE_ROLE`         |
| `GET`    | `/:lng/system/organizations`                          | List organizations                    | `READ_ORGANIZATION`   |
| `POST`   | `/:lng/system/organizations`                          | Create organization                   | `MANAGE_ORGANIZATION` |
| `GET`    | `/:lng/system/organizations/:organizationId`          | Get specific organization             | `READ_ORGANIZATION`   |
| `PUT`    | `/:lng/system/organizations/:organizationId`          | Update organization                   | `MANAGE_ORGANIZATION` |
| `DELETE` | `/:lng/system/organizations/:organizationId`          | Delete organization                   | `MANAGE_ORGANIZATION` |
| `GET`    | `/:lng/system/orphan-users`                           | List orphan users                     | `READ_USER`           |
| `DELETE` | `/:lng/system/orphan-users/:userId`                   | Delete orphan user                    | `MANAGE_USER`         |
| `GET`    | `/:lng/system/errors/api`                             | List API error logs                   | `READ_ERROR`          |
| `GET`    | `/:lng/system/errors/ui`                              | List UI error logs                    | `READ_ERROR`          |
| `GET`    | `/:lng/system/rbac/authorized-to-modify-user/:userId` | Check user modification authorization | `READ_USER`           |

## Organization Management Routes (Organization Permissions)

Endpoints for managing users and roles within specific organizations.

| Method   | Endpoint                                                       | Description                           | Required Permission |
| -------- | -------------------------------------------------------------- | ------------------------------------- | ------------------- |
| `GET`    | `/:lng/:organizationId/users`                                  | List organization users               | `READ_USER`         |
| `POST`   | `/:lng/:organizationId/users`                                  | Create organization user              | `MANAGE_USER`       |
| `GET`    | `/:lng/:organizationId/users/:userId`                          | Get specific organization user        | `READ_USER`         |
| `PUT`    | `/:lng/:organizationId/users/:userId`                          | Update organization user              | `MANAGE_USER`       |
| `GET`    | `/:lng/:organizationId/roles`                                  | List organization roles               | `READ_ROLE`         |
| `POST`   | `/:lng/:organizationId/roles`                                  | Create organization role              | `MANAGE_ROLE`       |
| `GET`    | `/:lng/:organizationId/roles/:roleId`                          | Get specific organization role        | `READ_ROLE`         |
| `PUT`    | `/:lng/:organizationId/roles/:roleId`                          | Update organization role              | `MANAGE_ROLE`       |
| `DELETE` | `/:lng/:organizationId/roles/:roleId`                          | Delete organization role              | `MANAGE_ROLE`       |
| `GET`    | `/:lng/:organizationId/rbac/authorized-to-modify-user/:userId` | Check user modification authorization | `READ_USER`         |

## Request/Response Format

### Common Request Headers

```
Content-Type: application/json
Accept-Language: en|nl
Cookie: user_session=<encrypted_session_cookie>
```

### Common Response Format

**Success Response:**

```json
{
  "data": {
    // Response data
  }
}
```

**Error Response:**

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Localized error message"
  },
  "validationErrors": {
    "field": "Validation error message"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Pagination and Filtering

List endpoints support pagination and filtering through query parameters:

### Query Parameters

- `page` - Page number (starts from 1)
- `size` - Number of items per page (1-100)
- `sortBy` - Field to sort by
- `sortOrder` - Sort direction (`asc` or `desc`)

### Example Request

```
GET /:lng/system/users?page=1&size=20&sortBy=name&sortOrder=asc
```

### Paginated Response

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## API Overview

The API provides comprehensive endpoints for:

- **Analytics**: Event tracking, user behavior analytics, and organization statistics
- **Authentication**: Email/OTP verification, session management
- **User Management**: Profile management, preferences, organizations
- **System Administration**: Global user, role, and organization management
- **Organization Management**: Tenant-specific user and role management
- **Error Logging**: API and UI error tracking
- **RBAC**: Permission and authorization checking

All endpoints support internationalization with `/:lng` prefix (e.g., `/en/auth/session`).

## Error Handling

The API implements comprehensive error handling with:

- **Localized error messages** based on Accept-Language header
- **Structured error responses** with error codes
- **Validation error details** for form submissions
- **Request context logging** for debugging

### Common Error Codes

- `DUPLICATE_ORGANIZATION_CODE` - Organization code already exists
- `INVALID_OTP` - Invalid OTP provided
- `INVALID_TOKEN` - Invalid authentication token
- `NOT_FOUND` - Requested resource not found
- `SESSION_EXPIRED` - User session expired
- `SYSTEM_USER_EXISTS` - System user already exists
- `TOO_EARLY_TO_RESEND_OTP` - OTP resend cooldown active
- `UNAUTHORIZED` - Unauthorized access attempt
- `USER_DOES_NOT_EXIST` - User not found
- `USER_EXISTS` - User already exists

## Rate Limiting

API endpoints may be subject to rate limiting to prevent abuse. Rate limit information is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for specified origins configured via the `ALLOWED_ORIGINS` environment variable.

## API Versioning

Currently, the API doesn't implement versioning. Future versions will be accessible via version prefixes (e.g., `/v2/:lng/endpoint`).
