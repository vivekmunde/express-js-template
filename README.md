# q-server

A comprehensive Node.js REST API server built with Express.js, TypeScript, MongoDB, and Prisma ORM, featuring robust authentication, role-based access control (RBAC), multi-tenancy, and internationalization support.

## 📚 Documentation

| Document                                              | Description                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| **[API Documentation](./docs/api.md)**                | Complete API endpoints reference with request/response examples     |
| **[Authentication & RBAC](./docs/authentication.md)** | Authentication flow and role-based access control system            |
| **[Database Schema](./docs/db.md)**                   | Database models, relationships, and schema documentation            |
| **[Development Guide](./docs/development.md)**        | Setup instructions, environment variables, and development workflow |

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Cookie-based sessions with OTP verification
- **Authorization**: Role-Based Access Control (RBAC) system
- **Internationalization**: i18next (English & Dutch support)
- **Development Tools**:
  - TypeScript for type-safe development
  - ESLint for code linting
  - Prettier for code formatting
  - Husky for Git hooks
  - Docker and Docker Compose for containerization
  - Zod for request validation

## Features

### Core Features

- **RESTful API architecture** with Express.js and TypeScript
- **MongoDB database integration** using Prisma ORM with modular schema
- **Comprehensive authentication system** with email verification and OTP
- **Advanced two-tier RBAC system** (System and Organization levels)
- **Multi-tenant organization support** with custom theming
- **Multi-language support** (English and Dutch)
- **Comprehensive error logging** to database (API and UI errors)
- **Analytics tracking system** with user behavior and organization statistics
- **Change audit trails** for all data modifications
- **Request validation** with Zod schemas
- **Docker containerization** for development and production

### Authentication & Authorization

- **Email + OTP authentication flow**
- **Secure cookie-based sessions** with encryption
- **Two-tier RBAC system**:
  - **System-level permissions**: Global operations across the platform
  - **Organization-level permissions**: Tenant-specific operations within organizations
- **Granular permissions**:
  - `READ_ERROR` - View error logs
  - `READ_ORGANIZATION` - View organizations
  - `MANAGE_ORGANIZATION` - Create, update, delete organizations
  - `READ_ROLE` - View roles
  - `MANAGE_ROLE` - Create, update, delete roles
  - `READ_USER` - View users
  - `MANAGE_USER` - Create, update, delete users

### Multi-Tenancy & Organization Features

- **Organization management** with unique codes
- **Custom theming support** (light/dark modes with custom colors)
- **Organization-specific permissions**
- **User role assignment** per organization
- **Orphan user management** for users without organization affiliations

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Yarn package manager
- MongoDB instance

### Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd q-server
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma client**

   ```bash
   yarn prisma:generate
   ```

5. **Start development**

   ```bash
   # Local development
   yarn dev

   # Or with Docker
   docker-compose up
   ```

The application will be available at `http://localhost:3000`

## Docker Support

### Quick Start with Docker Compose

```bash
# Start all services (app + MongoDB)
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t q-server .

# Run container
docker run -p 3000:3000 --env-file .env q-server
```

## Available Scripts

| Script                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `yarn dev`             | Start development server with full pipeline |
| `yarn build`           | Compile TypeScript to JavaScript            |
| `yarn start`           | Start production server                     |
| `yarn prisma:generate` | Generate Prisma client                      |
| `yarn format`          | Format code with Prettier                   |
| `yarn lint`            | Lint code with ESLint                       |

For complete scripts reference, see [Development Guide](./docs/development.md).

## Project Structure

```
q-server/
├── src/                    # Source code
│   ├── auth/               # Authentication modules
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── middlewares/        # Express middlewares
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── schema/                 # Modular Prisma schema files
├── docs/                   # Documentation
├── docker-compose.yml      # Docker development setup
└── package.json           # Dependencies and scripts
```

For detailed project structure, see [Development Guide](./docs/development.md).

## API Overview

The API provides comprehensive endpoints for:

- **Authentication**: Email/OTP verification, session management
- **User Management**: Profile management, preferences, organizations
- **System Administration**: Global user, role, and organization management
- **Organization Management**: Tenant-specific user and role management
- **Analytics**: Event tracking, user behavior analytics, and organization statistics
- **Error Logging**: API and UI error tracking
- **RBAC**: Permission and authorization checking

All endpoints support internationalization with `/:lng` prefix (e.g., `/en/auth/session`).

For complete API documentation, see [API Documentation](./docs/api.md).

## Key Concepts

### RBAC System

- **Two-tier permissions**: System-level and organization-level
- **Flexible roles**: Custom roles with granular permissions
- **Authority validation**: Users can only manage within their authority
- **Multi-tenancy**: Isolated permissions per organization

### Organization Features

- **Custom theming**: Light/dark themes with custom colors
- **Unique codes**: URL-friendly organization identifiers
- **Permission scoping**: Organization-specific available permissions
- **User isolation**: Complete data separation between organizations

### Analytics & Tracking

- **Event tracking**: Comprehensive user interaction logging
- **Organization statistics**: Aggregated metrics per organization
- **User behavior analytics**: Individual user activity patterns
- **Hierarchical view tracking**: Parent-child view relationships
- **Metadata support**: Flexible custom data attachment
- **Privacy-aware**: Optional user association and IP tracking

### Security

- **Encrypted sessions**: Secure cookie-based authentication
- **OTP verification**: 4-digit codes with expiration
- **Request validation**: Zod schemas for all inputs
- **Audit trails**: Complete change logging for compliance

For detailed information, see [Authentication & RBAC](./docs/authentication.md).

## Database

The application uses MongoDB with Prisma ORM and features:

- **Modular schema**: Organized by domain for maintainability
- **Change logs**: Complete audit trails for all models
- **Analytics storage**: Event tracking with aggregated statistics
- **Type safety**: Generated TypeScript types
- **Flexible permissions**: Array-based permission storage

For complete database documentation, see [Database Schema](./docs/db.md).

## License

MIT

## Support

- **Documentation**: Check the [docs](./docs/) directory
- **Issues**: Create GitHub issues for bugs or feature requests
- **Development**: Follow the [Development Guide](./docs/development.md)
- **API Reference**: See [API Documentation](./docs/api.md)
