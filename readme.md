# User Management System

A comprehensive user management system built with Node.js, TypeScript, and MongoDB following Domain-Driven Design (DDD) architecture principles.

## Features

- **User Management**: Complete CRUD operations for users
- **Role-Based Access Control (RBAC)**: Flexible role and permission system
- **Authentication & Authorization**: JWT-based auth with middleware protection
- **Clean Architecture**: DDD principles with clear separation of concerns
- **Comprehensive Testing**: Unit and integration tests with Jest
- **Input Validation**: Zod-based request validation
- **Auto-mapping**: Entity-DTO mapping with AutoMapper

## Architecture

```
src/
├── domain/                 # Business logic and rules
│   ├── entities/          # Core business entities
│   ├── value-objects/     # Immutable value objects
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/           # Application layer
│   ├── dto/              # Data transfer objects
│   ├── services/         # Application services
│   └── use-cases/        # Business use cases
├── infrastructure/       # External concerns
│   ├── database/         # Database models
│   ├── repositories/     # Repository implementations
│   └── mappers/          # Object mapping
├── presentation/         # API layer
│   ├── controllers/      # HTTP controllers
│   ├── routes/          # Route definitions
│   └── middleware/      # HTTP middleware
└── shared/              # Shared utilities
    ├── middleware/      # Common middleware
    ├── validation/      # Input validation schemas
    └── constants/       # Application constants
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed the database:
```bash
npm run seed
```

4. Start development server:
```bash
npm run dev
```

### Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Roles
- `POST /api/v1/roles` - Create role
- `GET /api/v1/roles` - Get all roles
- `GET /api/v1/roles/:id` - Get role by ID

### Permissions
- `POST /api/v1/permissions` - Create permission
- `GET /api/v1/permissions` - Get all permissions
- `GET /api/v1/permissions/:id` - Get permission by ID

## Default Credentials

After seeding, you can login with:
- Email: `admin@example.com`
- Password: `admin123`

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/user-management
JWT_ACCESS_TOKEN=your-access-token-secret
JWT_ACCESS_EXPIRES_IN=3600
JWT_REFRESH_TOKEN=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=86400
```

## Permission System

The system uses action-based permissions with the format `resource:action`:

- `user:create`, `user:read`, `user:update`, `user:delete`
- `role:create`, `role:read`, `role:update`, `role:delete`
- `permission:create`, `permission:read`, `permission:update`, `permission:delete`

## Built With

- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework
- **Zod** - Input validation
- **AutoMapper** - Object mapping