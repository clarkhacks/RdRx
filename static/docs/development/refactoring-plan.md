# RdRx Codebase Refactoring Plan

## 🚧 In Progress

### Priority 2: File Organization & Structure

#### 2.1 Split Large Route Files

**Files to Split:**

##### `src/routes/customAuth.ts` (821 lines) → Split into:

```
src/routes/auth/
  ├── login.ts          # POST /login
  ├── register.ts       # POST /register
  ├── logout.ts         # POST /logout
  ├── verify.ts         # GET /verify/:token
  ├── resetPassword.ts  # POST /reset-password, /reset-password/:token
  └── index.ts          # Route aggregator
```

##### `src/routes/admin.ts` (454 lines) → Split into:

```
src/routes/admin/
  ├── users.ts          # User management
  ├── urls.ts           # URL management
  ├── analytics.ts      # Analytics operations
  └── index.ts          # Route aggregator
```

##### `src/routes/bio.ts` (435 lines) → Split into:

```
src/routes/bio/
  ├── view.ts           # GET /bio-view/:shortcode
  ├── edit.ts           # GET /bio/edit
  ├── save.ts           # POST /api/bio/save
  ├── upload.ts         # POST /api/bio/og-image
  └── index.ts          # Route aggregator
```

#### 2.3 Component Organization

**Large Components to Refactor:**

##### `src/components/ui/BioEditorUI.ts` (986 lines) → Extract:

```
src/components/bio/
  ├── BioEditor.ts      # Main editor component
  ├── LinkEditor.ts     # Link management section
  ├── StyleEditor.ts    # Style customization section
  ├── PreviewPane.ts    # Live preview component
  └── styles/
      └── bioEditor.css # Extracted CSS
```

##### `src/components/auth/ResetPasswordForm.ts` (807 lines) → Extract:

```
src/components/auth/
  ├── ResetPasswordForm.ts  # Main form (200 lines)
  ├── PasswordStrength.ts   # Password validation UI
  └── styles/
      └── resetPassword.css # Extracted inline styles
```

---

## 📋 Pending

### Priority 3: Code Duplication Elimination

#### 3.1 Extract Common UI Patterns

**Create `src/components/common/`:**

```typescript
// src/components/common/Button.ts
export function Button(props: { text: string; type?: 'primary' | 'secondary' | 'danger'; onClick?: string; disabled?: boolean }) {
	/* ... */
}

// src/components/common/Card.ts
export function Card(props: { title?: string; children: string; className?: string }) {
	/* ... */
}

// src/components/common/Input.ts
export function Input(props: { name: string; type: string; label: string; required?: boolean; value?: string }) {
	/* ... */
}
```

#### 3.2 Extract Common Styles

**Create `src/styles/`:**

```
src/styles/
  ├── variables.css     # CSS custom properties
  ├── utilities.css     # Utility classes
  ├── components.css    # Reusable component styles
  └── themes.css        # Dark/light theme definitions
```

---

### Priority 4: Documentation & Comments

#### 4.1 Add JSDoc Comments

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

#### 4.2 Add README Files

**Create documentation in each major directory:**

```
src/routes/README.md
src/components/README.md
src/utils/README.md
src/middleware/README.md
```

---

### Priority 5: Type Safety Improvements

#### 5.1 Create Comprehensive Type Definitions

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

---

## Implementation Roadmap

### Phase 3: Routes Refactoring ✅ **COMPLETED**

- ✅ Split `customAuth.ts` into `src/routes/auth/`
  - ✅ `src/routes/auth/api.ts` - All API endpoint handlers
  - ✅ `src/routes/auth/pages.ts` - All page rendering handlers
  - ✅ `src/routes/auth/index.ts` - Route aggregator
- ✅ Split `admin.ts` into `src/routes/admin/`
  - ✅ `src/routes/admin/users.ts` - User management handlers
  - ✅ `src/routes/admin/urls.ts` - URL management handlers
  - ✅ `src/routes/admin/stats.ts` - Statistics and analytics handlers
  - ✅ `src/routes/admin/email.ts` - Email configuration and testing
  - ✅ `src/routes/admin/index.ts` - Route aggregator
- ✅ Split `bio.ts` into `src/routes/bio/`
  - ✅ `src/routes/bio/handlers.ts` - Bio page handlers (form, editor, view, save, get)
  - ✅ `src/routes/bio/upload.ts` - OG image upload handler
  - ✅ `src/routes/bio/index.ts` - Re-exports all handlers
- ✅ Maintained backward compatibility with re-exports

### Phase 4: Components

- [ ] Extract common UI components
- [ ] Split large component files
- [ ] Extract inline CSS to separate files
- [ ] Create component documentation

### Phase 5: Testing & Documentation

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

## ✅ Completed

### Priority 1: Critical Security & Architecture Issues

#### 1.1 Password Hashing Inconsistency ✅ **RESOLVED**

**Problem:** Two different password hashing implementations:

- `src/utils/database.ts` - Uses weak SHA-256 without salt for shortcode passwords
- `src/components/auth/utils.ts` - Uses secure PBKDF2 with 100,000 iterations

**Solution Implemented:**

- ✅ Created `src/utils/crypto.ts` with unified secure hashing
- ✅ All password hashing now uses PBKDF2 with 100,000 iterations
- ✅ Secure salt generation implemented
- ✅ Token generation for email verification/password reset

#### 1.2 CORS Headers Duplication ✅ **RESOLVED**

**Problem:** CORS headers repeated in 5+ files

**Solution Implemented:**

- ✅ Created `src/middleware/cors.ts`
- ✅ Centralized CORS configuration
- ✅ Preflight request handling
- ✅ CORS middleware wrapper
- ✅ Helper functions for adding CORS headers

---

### Priority 2: File Organization & Structure

#### 2.2 Split Database Utilities ✅ **COMPLETED**

**`src/utils/database.ts` (538 lines) → Split into:**

```
src/database/
  ✅ urls.ts           # URL operations (saveUrlToDatabase, getUrlFromDatabase)
  ✅ bio.ts            # Bio operations (saveBioProfile, getBioPage)
  ✅ analytics.ts      # Analytics operations (saveAnalytics, getAnalytics)
  ✅ deletion.ts       # Deletion operations (saveDeletionEntry, deleteDeletionEntry)
  ✅ init.ts           # Database initialization (initializeTables)
  ✅ passwords.ts      # Password operations
  ✅ index.ts          # Re-export all functions
```

---

### Priority 3: Code Duplication Elimination

#### 3.3 Centralize Constants ✅ **COMPLETED**

**Created `src/config/constants.ts`:**

- ✅ Authentication & security constants (PASSWORD_MIN_LENGTH, PBKDF2_ITERATIONS, etc.)
- ✅ Shortcode configuration (length, charset, reserved words)
- ✅ File upload limits and allowed types
- ✅ Rate limiting configuration
- ✅ Pagination defaults
- ✅ Analytics settings
- ✅ Centralized ERROR_MESSAGES object
- ✅ Centralized SUCCESS_MESSAGES object
- ✅ HTTP status codes
- ✅ Regular expressions (EMAIL_REGEX, SHORTCODE_REGEX, URL_REGEX)
- ✅ Feature flags for gradual rollout

---

### Priority 5: Type Safety Improvements

#### 5.2 Add Validation Schemas ✅ **COMPLETED**

**Created `src/validation/`:**

```typescript
✅ src/validation/url.ts        # URL validation with error messages
✅ src/validation/shortcode.ts  # Shortcode validation with reserved words
✅ src/validation/auth.ts       # Email and password validation
✅ src/validation/index.ts      # Centralized exports
```

Features:

- ✅ Boolean validation functions (isValidUrl, isValidShortcode, isValidEmail)
- ✅ Detailed validation results with error messages
- ✅ Assert functions that throw ValidationError
- ✅ Reserved shortcode checking
- ✅ Integration with centralized error messages

---

### Priority 6: Error Handling Improvements

#### 6.1 Create Error Classes ✅ **COMPLETED**

**Created `src/errors/`:**

```typescript
✅ src/errors/AppError.ts            # Base error class with HTTP status codes
✅ src/errors/ValidationError.ts     # Input validation errors (400)
✅ src/errors/AuthenticationError.ts # Auth failures (401)
✅ src/errors/NotFoundError.ts       # Missing resources (404)
✅ src/errors/ConflictError.ts       # Duplicate resources (409)
✅ src/errors/index.ts               # Centralized exports
```

Features:

- ✅ Proper stack traces
- ✅ HTTP status codes
- ✅ Machine-readable error codes
- ✅ JSON serialization
- ✅ TypeScript type safety

#### 6.2 Centralized Error Handler ✅ **COMPLETED**

**Created `src/middleware/errorHandler.ts`:**

- ✅ Centralized error handling function
- ✅ Consistent error responses
- ✅ Async error wrapper utility
- ✅ Proper logging
- ✅ Handles AppError instances and unknown errors

---

### Phase 1: Foundation ✅ **COMPLETED**

- ✅ Create new directory structure
- ✅ Extract constants to `src/config/constants.ts`
- ✅ Create unified crypto utilities in `src/utils/crypto.ts` (already existed)
- ✅ Set up error classes in `src/errors/`
- ✅ Create CORS middleware in `src/middleware/cors.ts`
- ✅ Create error handler middleware in `src/middleware/errorHandler.ts`
- ✅ Create validation utilities in `src/validation/`

### Phase 2: Database Layer ✅ **COMPLETED**

- ✅ Split `src/utils/database.ts` into `src/database/` modules
- ✅ Add comprehensive JSDoc comments
- ✅ Implement type-safe database operations
- ✅ Add validation layer

---

## Notes

- All refactoring should be done incrementally with tests
- Maintain backward compatibility during migration
- Use feature flags for gradual rollout
- Document all breaking changes

---

**Last Updated:** May 3, 2026  
**Status:** In Progress - Phase 3 (Routes Refactoring)

**Completed:** Phases 1 & 2 (Foundation & Database Layer)  
**Current:** Phase 3 (Routes Refactoring)  
**Remaining:** Phases 4 & 5 (Components & Testing/Documentation)
