# Development Guide

This document provides comprehensive information for setting up and developing the q-server application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Docker Development](#docker-development)
- [Scripts Reference](#scripts-reference)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)

## Prerequisites

Before starting development, ensure you have the following installed:

### Required Software

- **Node.js 18+**: Runtime environment
- **Yarn**: Package manager (configured in package.json)
- **Docker & Docker Compose**: For containerized development
- **MongoDB**: Database (can be run via Docker)
- **Git**: Version control

### Recommended Tools

- **VS Code**: Editor with TypeScript support
- **MongoDB Compass**: GUI for database management
- **Postman/Insomnia**: API testing
- **Docker Desktop**: GUI for Docker management

### System Requirements

- **Memory**: Minimum 8GB RAM
- **Storage**: 5GB free space for dependencies and Docker images
- **OS**: macOS, Linux, or Windows with WSL2

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd q-server
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)
```

### 4. Generate Prisma Client

```bash
yarn prisma:generate
```

### 5. Start Development

```bash
# Option 1: Local development
yarn dev

# Option 2: Docker development
docker-compose up
```

## Environment Variables

All environment variables are required and must be configured properly.

| Variable                            | Description                                  | Example                                         | Required |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------------- | -------- |
| `PORT`                              | Server port number                           | `3000`                                          | Yes      |
| `HOST_URL`                          | Application host URL                         | `http://localhost:3000`                         | Yes      |
| `DATABASE_URL`                      | MongoDB connection string                    | `mongodb://localhost:27017/q-server`            | Yes      |
| `ALLOWED_ORIGINS`                   | Comma-separated list of allowed CORS origins | `http://localhost:3000,https://app.example.com` | Yes      |
| `ENCRYPTION_KEY`                    | Key for encrypting session cookies           | `your-secret-key-here`                          | Yes      |
| `USER_LOGIN_SESSION_COOKIE_NAME`    | Name for OTP session cookie                  | `user_login_session`                            | Yes      |
| `USER_LOGIN_SESSION_COOKIE_MAX_AGE` | OTP session cookie lifetime (seconds)        | `1800`                                          | Yes      |
| `USER_SESSION_COOKIE_NAME`          | Name for user session cookie                 | `user_session`                                  | Yes      |
| `USER_SESSION_COOKIE_MAX_AGE`       | User session cookie lifetime (seconds)       | `86400`                                         | Yes      |
| `AMAZON_AWS_REGION`                 | AWS region for SES email service             | `us-east-1`                                     | Yes      |
| `AMAZON_AWS_ACCESS_KEY_ID`          | AWS access key for SES                       | `AKIAIOSFODNN7EXAMPLE`                          | Yes      |
| `AMAZON_AWS_SECRET_ACCESS_KEY`      | AWS secret key for SES                       | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`      | Yes      |
| `AMAZON_AWS_SES_FROM_EMAIL`         | Email address for sending emails             | `noreply@example.com`                           | Yes      |
| `AMAZON_AWS_SES_FROM_NAME`          | Display name for sent emails                 | `Your App Name`                                 | Yes      |

### Environment File Example

```bash
# .env
PORT=3000
HOST_URL=http://localhost:3000
DATABASE_URL=mongodb://localhost:27017/q-server-dev
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ENCRYPTION_KEY=your-very-secure-encryption-key-here
USER_LOGIN_SESSION_COOKIE_NAME=user_login_session
USER_LOGIN_SESSION_COOKIE_MAX_AGE=1800
USER_SESSION_COOKIE_NAME=user_session
USER_SESSION_COOKIE_MAX_AGE=86400

# AWS SES Configuration for Email Service
AMAZON_AWS_REGION=us-east-1
AMAZON_AWS_ACCESS_KEY_ID=your-aws-access-key-id
AMAZON_AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AMAZON_AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AMAZON_AWS_SES_FROM_NAME=Your Application Name
```

### Security Considerations

- **Never commit .env files** to version control
- **Use strong encryption keys** (minimum 32 characters)
- **Rotate keys regularly** in production
- **Use different keys** for different environments

## Development Workflow

### Local Development

The development server includes:

1. **Code Formatting**: Prettier auto-formatting
2. **Linting**: ESLint validation
3. **Type Checking**: TypeScript compilation
4. **Schema Generation**: Prisma client generation
5. **Hot Reload**: File watching with tsx

```bash
yarn dev
```

### Development Server Features

- **Auto-restart**: Server restarts on file changes
- **Error Display**: Clear error messages in console
- **Request Logging**: HTTP request logging
- **Type Safety**: Real-time TypeScript checking

### Common Development Tasks

#### Database Operations

```bash
# Generate Prisma client after schema changes
yarn prisma:generate

# Push schema changes to database
yarn prisma:push

# Reset database (development only)
yarn prisma:reset
```

#### Code Quality

```bash
# Format all files
yarn format

# Check formatting
yarn format:check

# Lint code
yarn lint

# Type check
yarn tsc
```

#### Building and Testing

```bash
# Build for production
yarn build

# Start production server
yarn start
```

## Docker Development

Docker provides a consistent development environment across different machines.

### Development Container Setup

The `docker-compose.yml` includes:

- **Application container**: Node.js app with hot reload
- **MongoDB container**: Database service
- **Volume mounting**: Live code updates
- **Environment variables**: Loaded from .env file

### Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Shell into app container
docker-compose exec app sh
```

### Docker Development Benefits

- **Consistent Environment**: Same Node.js and MongoDB versions
- **Easy Setup**: One command to start everything
- **Isolation**: No conflicts with local installations
- **Production Parity**: Similar to production environment

### Docker Troubleshooting

```bash
# View container status
docker-compose ps

# Check logs for errors
docker-compose logs app
docker-compose logs mongo

# Restart specific service
docker-compose restart app

# Clean up volumes (caution: deletes data)
docker-compose down -v
```

## Scripts Reference

The following scripts are available for development and production tasks.

| Script                  | Description                                 | Usage             |
| ----------------------- | ------------------------------------------- | ----------------- |
| `yarn dev`              | Start development server with full pipeline | Development       |
| `yarn build`            | Compile TypeScript to JavaScript            | Production Build  |
| `yarn start`            | Start production server                     | Production        |
| `yarn prisma:aggregate` | Combine schema files into single schema     | Schema Management |
| `yarn prisma:generate`  | Generate Prisma client                      | Development       |
| `yarn prisma:push`      | Push schema changes to database             | Development       |
| `yarn format`           | Format code with Prettier                   | Code Quality      |
| `yarn format:check`     | Check code formatting                       | CI/CD             |
| `yarn lint`             | Lint code with ESLint                       | Code Quality      |
| `yarn tsc`              | Run TypeScript compiler                     | Type Checking     |

### Script Details

#### Development Script (`yarn dev`)

Runs the complete development pipeline:

1. `npm run format` - Format code with Prettier
2. `npm run lint` - Lint code with ESLint
3. `npm run tsc` - Compile TypeScript
4. `npm run prisma:generate` - Generate Prisma client
5. `tsx watch src/index.ts` - Start server with hot reload

#### Prisma Scripts

- **aggregate**: Combines modular schema files into single `schema.prisma`
- **generate**: Creates TypeScript types from schema
- **push**: Applies schema changes to database without migrations

## Project Structure

Understanding the project structure helps with navigation and development.

```
q-server/
├── src/                           # Source code
│   ├── auth/                      # Authentication modules
│   │   ├── user-login-session.ts  # OTP session management
│   │   └── user-session.ts        # User session management
│   ├── constants/                 # Application constants
│   │   └── status-codes.ts        # HTTP status codes
│   ├── locales/                   # Internationalization
│   │   ├── en/                    # English translations
│   │   └── nl/                    # Dutch translations
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.ts                # Authentication middleware
│   │   ├── cors.ts                # CORS configuration
│   │   ├── error.ts               # Error handling
│   │   └── i18n.ts                # Internationalization
│   ├── request/                   # Request utilities
│   │   ├── if-valid-*.ts          # Validation helpers
│   │   └── if-*.ts                # Conditional handlers
│   ├── response/                  # Response utilities
│   ├── route-handlers/            # Route abstractions
│   │   ├── protected-*.ts         # Protected route handlers
│   │   └── public-route-handler.ts
│   ├── routes/                    # API endpoints
│   │   ├── analytics/             # Analytics tracking routes
│   │   ├── auth/                  # Authentication routes
│   │   ├── errors/                # Error logging routes
│   │   ├── heart-beat/            # Health check routes
│   │   ├── me/                    # User profile routes
│   │   ├── system/                # System management
│   │   ├── [organizationId]/      # Organization routes
│   │   └── index.ts               # Route registration
│   ├── services/                  # Business logic
│   │   ├── rbac/                  # RBAC services
│   │   └── change-log/            # Audit logging
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Utility functions
│   ├── env.ts                     # Environment config
│   ├── index.ts                   # Application entry
│   └── prisma.ts                  # Database client
├── schema/                        # Prisma schema files
├── scripts/                       # Build scripts
├── docs/                          # Documentation
├── docker-compose.yml             # Docker development
├── Dockerfile                     # Container definition
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript config
```

### Key Directories

- **`src/routes/`**: API endpoint definitions
- **`src/services/`**: Business logic and RBAC
- **`src/middlewares/`**: Express middleware functions
- **`schema/`**: Modular Prisma schema files
- **`docs/`**: Comprehensive documentation

## Code Quality

The project enforces code quality through multiple tools and practices.

### TypeScript Configuration

- **Strict mode**: Enabled for maximum type safety
- **Path mapping**: Absolute imports with `@/` prefix
- **Target**: ES2020 for modern JavaScript features

### ESLint Configuration

- **TypeScript support**: `@typescript-eslint/parser`
- **Prettier integration**: `eslint-config-prettier`
- **Modern practices**: ES2020+ syntax support

### Prettier Configuration

- **Consistent formatting**: Automatic code formatting
- **Git hooks**: Pre-commit formatting via Husky
- **Silent logging**: Reduced console output

### Git Hooks (Husky)

- **Pre-commit**: Format and lint code before commit
- **Automated quality**: Ensures consistent code quality

### Development Best Practices

1. **Type Safety**: Always add proper TypeScript types
2. **Error Handling**: Use proper error handling patterns
3. **Validation**: Add Zod schemas for all request endpoints
4. **Testing**: Write tests for new functionality
5. **Documentation**: Update docs for new features
6. **Security**: Consider RBAC implications for new routes

### Debugging

#### Debug Mode

Set environment variable for debug output:

```bash
DEBUG=* yarn dev
```

#### VS Code Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["-r", "tsx/cjs"]
    }
  ]
}
```

#### Common Issues

1. **Port conflicts**: Check if port 3000 is already in use
2. **Database connection**: Ensure MongoDB is running
3. **Environment variables**: Verify all required vars are set
4. **Prisma client**: Run `yarn prisma:generate` after schema changes
5. **Docker issues**: Check `docker-compose logs` for errors

### Performance Considerations

- **Database indexes**: Ensure proper indexing for queries
- **Caching**: Consider Redis for session storage in production
- **Error logging**: Monitor error log volume
- **Memory usage**: Monitor Node.js memory consumption

### Production Deployment

For production deployment considerations:

1. **Environment**: Use production environment variables
2. **Database**: Use managed MongoDB service
3. **Monitoring**: Implement application monitoring
4. **Logging**: Configure structured logging
5. **Security**: Enable security headers and HTTPS
6. **Backup**: Implement automated backup strategy
