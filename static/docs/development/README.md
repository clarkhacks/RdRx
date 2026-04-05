# Development Guide

This guide covers the architecture, development workflow, and best practices for contributing to RdRx.

## Architecture Overview

RdRx follows a modular architecture with clear separation of concerns:

```
src/
├── database/          # Database operations by domain
│   ├── init.ts       # Database initialization
│   ├── urls.ts       # URL CRUD operations
│   ├── passwords.ts  # Password hashing & verification
│   ├── analytics.ts  # Analytics tracking
│   ├── deletion.ts   # Scheduled deletion management
│   ├── bio.ts        # Bio profile operations
│   └── index.ts      # Barrel export
├── routes/           # HTTP route handlers
│   ├── index.ts      # Main router
│   ├── api.ts        # API endpoints
│   ├── shortcode.ts  # Shortcode resolution
│   ├── bio.ts        # Bio page routes
│   └── ...
├── components/       # UI components and pages
│   ├── pages/        # Full page components
│   ├── layouts/      # Layout components
│   ├── ui/           # Reusable UI components
│   └── auth/         # Authentication components
├── middleware/       # Request/response middleware
│   ├── auth.ts       # Authentication middleware
│   ├── cors.ts       # CORS handling
│   └── errorHandler.ts # Error handling
├── validation/       # Input validation
│   ├── url.ts        # URL validation
│   ├── shortcode.ts  # Shortcode validation
│   └── auth.ts       # Auth validation
├── errors/           # Custom error classes
│   ├── AppError.ts   # Base error class
│   ├── ValidationError.ts
│   └── ...
├── utils/            # Utility functions
│   ├── crypto.ts     # Cryptographic functions
│   ├── shortcode.ts  # Shortcode generation
│   └── logger.ts     # Logging utilities
└── types/            # TypeScript type definitions
    └── index.ts      # Shared types
```

## Database Module

The database module is organized by domain for better maintainability:

### Initialization (`database/init.ts`)
- Creates all database tables
- Initializes users table via auth module
- Safe to call multiple times (uses IF NOT EXISTS)

### URLs (`database/urls.ts`)
- CRUD operations for URL shortcodes
- Special handling for legacy shortcodes
- Automatic type detection (snippet, file, bio)

### Passwords (`database/passwords.ts`)
- Password hashing and verification
- Automatic migration from SHA-256 to PBKDF2
- Backward compatible with existing hashes

### Analytics (`database/analytics.ts`)
- View tracking with minimal data
- Geographic distribution
- Privacy-focused (no PII)

### Deletion (`database/deletion.ts`)
- Scheduled deletion management
- Automatic cleanup via cron
- R2 file deletion for file shortcodes

### Bio (`database/bio.ts`)
- Bio profile CRUD operations
- Link and social media management
- SEO metadata support

## Development Workflow

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm type-check

# Lint code
pnpm lint
```

### 2. Making Changes

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Run type checking and linting
5. Commit with descriptive messages
6. Push and create a pull request

### 3. Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use meaningful variable names
- Keep functions small and focused

### 4. Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Best Practices

### TypeScript

- Use strict mode
- Define interfaces for data structures
- Avoid `any` type
- Use type guards for runtime checks

### Error Handling

- Use custom error classes
- Provide meaningful error messages
- Log errors appropriately
- Handle errors at the right level

### Security

- Validate all user input
- Use parameterized queries
- Hash passwords with PBKDF2
- Implement rate limiting
- Use CORS appropriately

### Performance

- Minimize database queries
- Use caching where appropriate
- Optimize bundle size
- Lazy load components

## Project History

### Phase 1: Foundation Refactoring
- Created modular error handling system
- Implemented input validation layer
- Set up middleware architecture
- Established coding standards

See [Phase 1 Summary](phase1-summary.md) for details.

### Phase 2: Database Refactoring
- Split monolithic database file into domain modules
- Implemented password hash migration
- Added comprehensive JSDoc documentation
- Improved type safety

See [Phase 2 Plan](phase2-plan.md) for details.

## Contributing

See [Contributing Guide](../contributing.md) for information on:
- Code of conduct
- Pull request process
- Coding standards
- Review process

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
