# RdRx Codebase Refactoring Plan

## Executive Summary

Based on comprehensive analysis of the RdRx codebase, this document outlines a strategic refactoring plan to improve code readability, maintainability, and organization. The project currently has **38 TypeScript files** with several files exceeding 500 lines, code duplication across modules, and inconsistent patterns.

---

## Priority 1: Critical Security & Architecture Issues

### 1.1 Password Hashing Inconsistency ⚠️ **SECURITY RISK**
**Problem:** Two different password hashing implementations:
- `src/utils/database.ts` - Uses weak SHA-256 without salt for shortcode passwords
- `src/components/auth/utils.ts` - Uses secure PBKDF2 with 100,000 iterations

**Solution:**
- Create `src/utils/crypto.ts` with unified secure hashing
- Migrate all password hashing to PBKDF2
- Add migration script for existing shortcode passwords

### 1.2 CORS Headers Duplication
**Problem:** CORS headers repeated in 5+ files

**Solution:**
- Create `src/middleware/cors.ts`
- Centralize CORS configuration
- Apply middleware globally

---

## Priority 2: File Organization & Structure

### 2.1 Split Large Route Files

**Files to Split:**

#### `src/routes/customAuth.ts` (821 lines) → Split into:
```
src/routes/auth/
  ├── login.ts          # POST /login
  ├── register.ts       # POST /register
  ├── logout.ts         # POST /logout
  ├── verify.ts         # GET /verify/:token
  ├── resetPassword.ts  # POST /reset-password, /reset-password/:token
  └── index.ts          # Route aggregator
```

#### `src/routes/admin.ts` (454 lines) → Split into:
```
src/routes/admin/
  ├── users.ts          # User management
  ├── urls.ts           # URL management
  ├── analytics.ts      # Analytics operations
  └── index.ts          # Route aggregator
```

#### `src/routes/bio.ts` (435 lines) → Split into:
```
src/routes/bio/
  ├── view.ts           # GET /bio-view/:shortcode
  ├── edit.ts           # GET /bio/edit
  ├── save.ts           # POST /api/bio/save
  ├── upload.ts         # POST /api/bio/og-image
  └── index.ts          # Route aggregator
```

### 2.2 Split Database Utilities

**`src/utils/database.ts` (538 lines) → Split into:**
```
src/database/
  ├── urls.ts           # URL operations (saveUrlToDatabase, getUrlFromDatabase)
  ├── users.ts          # User operations (getUserById, updateUser)
  ├── bio.ts            # Bio operations (saveBioProfile, getBioPage)
  ├── analytics.ts      # Analytics operations (saveAnalytics, getAnalytics)
  ├── deletion.ts       # Deletion operations (saveDeletionEntry, deleteDeletionEntry)
  ├── init.ts           # Database initialization (initializeTables)
  └── index.ts          # Re-export all functions
```

### 2.3 Component Organization

**Large Components to Refactor:**

#### `src/components/ui/BioEditorUI.ts` (986 lines) → Extract:
```
src/components/bio/
  ├── BioEditor.ts      # Main editor component
  ├── LinkEditor.ts     # Link management section
  ├── StyleEditor.ts    # Style customization section
  ├── PreviewPane.ts    # Live preview component
  └── styles/
      └── bioEditor.css # Extracted CSS
```

#### `src/components/auth/ResetPasswordForm.ts` (807 lines) → Extract:
```
src/components/auth/
  ├── ResetPasswordForm.ts  # Main form (200 lines)
  ├── PasswordStrength.ts   # Password validation UI
  └── styles/
      └── resetPassword.css # Extracted inline styles
```

---

## Priority 3: Code Duplication Elimination

### 3.1 Extract Common UI Patterns

**Create `src/components/common/`:**
```typescript
// src/components/common/Button.ts
export function Button(props: {
  text: string;
  type?: 'primary' | 'secondary' | 'danger';
  onClick?: string;
  disabled?: boolean;
}) { /* ... */ }

// src/components/common/Card.ts
export function Card(props: {
  title?: string;
  children: string;
  className?: string;
}) { /* ... */ }

// src/components/common/Input.ts
export function Input(props: {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  value?: string;
}) { /* ... */ }
```

### 3.2 Extract Common Styles

**Create `src/styles/`:**
```
src/styles/
  ├── variables.css     # CSS custom properties
  ├── utilities.css     # Utility classes
  ├── components.css    # Reusable component styles
  └── themes.css        # Dark/light theme definitions
```

### 3.3 Centralize Constants

**Create `src/config/constants.ts`:**
```typescript
export const PASSWORD_MIN_LENGTH = 8;
export const SHORTCODE_LENGTH = 6;
export const SESSION_COOKIE_NAME = 'session';
export const SESSION_EXPIRY_DAYS = 7;
export const RESET_TOKEN_EXPIRY_HOURS = 1;
export const PBKDF2_ITERATIONS = 100000;
export const SALT_LENGTH = 16;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  SHORTCODE_EXISTS: 'Shortcode already exists',
  // ... etc
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  // ... etc
};
```

---

## Priority 4: Documentation & Comments

### 4.1 Add JSDoc Comments

**Example for `src/utils/shortcode.ts`:**
```typescript
/**
 * Generates a random shortcode for URL shortening
 * 
 * @returns {string} A 6-character alphanumeric shortcode
 * 
 * @example
 * const code = generateShortcode(); // "aB3xY9"
 * 
 * @remarks
 * Uses crypto.getRandomValues() for cryptographically secure randomness.
 * Character set: a-z, A-Z, 0-9 (62 possible characters)
 * Collision probability: ~1 in 56 billion for 6 characters
 */
export function generateShortcode(): string {
  // Implementation...
}
```

### 4.2 Add README Files

**Create documentation in each major directory:**
```
src/routes/README.md
src/components/README.md
src/utils/README.md
src/middleware/README.md
```

---

## Priority 5: Type Safety Improvements

### 5.1 Create Comprehensive Type Definitions

**Enhance `src/types.ts`:**
```typescript
// Request types
export interface CreateShortUrlRequest {
  url?: string;
  snippet?: string;
  custom: boolean;
  custom_code?: string;
  admin_override_code?: string;
  delete_after?: string;
  userId?: string;
  password_protected?: boolean;
  password?: string;
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ShortUrlResponse {
  shortcode: string;
  url?: string;
  expires_at?: string;
}

// Database types
export interface ShortUrl {
  shortcode: string;
  target_url: string;
  created_at: number;
  user_id: string | null;
  password_hash: string | null;
  is_password_protected: boolean;
}

export interface User {
  uid: string;
  email: string;
  password_hash: string;
  created_at: number;
  verified: boolean;
  api_key: string | null;
}
```

### 5.2 Add Validation Schemas

**Create `src/validation/`:**
```typescript
// src/validation/url.ts
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// src/validation/shortcode.ts
export function validateShortcode(code: string): { valid: boolean; error?: string } {
  if (code.length < 3 || code.length > 50) {
    return { valid: false, error: 'Shortcode must be 3-50 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
    return { valid: false, error: 'Shortcode can only contain letters, numbers, hyphens, and underscores' };
  }
  return { valid: true };
}
```

---

## Priority 6: Error Handling Improvements

### 6.1 Create Error Classes

**Create `src/errors/`:**
```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// src/errors/ValidationError.ts
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// src/errors/AuthenticationError.ts
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}
```

### 6.2 Centralized Error Handler

**Create `src/middleware/errorHandler.ts`:**
```typescript
export function handleError(error: unknown): Response {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Unknown error
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Internal server error',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create new directory structure
- [ ] Extract constants to `src/config/constants.ts`
- [ ] Create unified crypto utilities in `src/utils/crypto.ts`
- [ ] Set up error classes in `src/errors/`

### Phase 2: Database Layer (Week 2)
- [ ] Split `src/utils/database.ts` into `src/database/` modules
- [ ] Add comprehensive JSDoc comments
- [ ] Implement type-safe database operations
- [ ] Add validation layer

### Phase 3: Routes Refactoring (Week 3)
- [ ] Split `customAuth.ts` into `src/routes/auth/`
- [ ] Split `admin.ts` into `src/routes/admin/`
- [ ] Split `bio.ts` into `src/routes/bio/`
- [ ] Extract middleware to separate files

### Phase 4: Components (Week 4)
- [ ] Extract common UI components
- [ ] Split large component files
- [ ] Extract inline CSS to separate files
- [ ] Create component documentation

### Phase 5: Testing & Documentation (Week 5)
- [ ] Add unit tests for utilities
- [ ] Add integration tests for routes
- [ ] Write comprehensive README files
- [ ] Update main documentation

---

## Success Metrics

- **Code Duplication:** Reduce from ~30% to <10%
- **Average File Size:** Reduce from 350 lines to <200 lines
- **Test Coverage:** Increase from 0% to >70%
- **Documentation:** 100% of public functions have JSDoc
- **Type Safety:** 100% of functions have explicit return types

---

## Notes

- All refactoring should be done incrementally with tests
- Maintain backward compatibility during migration
- Use feature flags for gradual rollout
- Document all breaking changes

---

**Last Updated:** April 4, 2026  
**Status:** Draft - Pending Review
