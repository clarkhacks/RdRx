# RdRx Refactoring - Phase 2 Implementation Plan

## Overview

Phase 2 focuses on splitting the monolithic `src/utils/database.ts` file (538 lines) into domain-specific modules for better organization and maintainability.

**Status:** 📋 Planning Complete - Ready for Implementation  
**Estimated Effort:** 3-4 hours  
**Risk Level:** Medium (requires careful import updates)

---

## Current State Analysis

### File to Split: `src/utils/database.ts` (538 lines)

**Function Breakdown:**
- **Initialization:** 1 function (72 lines)
- **URL Operations:** 4 functions (115 lines)
- **Password Operations:** 3 functions (58 lines)
- **Analytics:** 2 functions (45 lines)
- **Deletion:** 4 functions (78 lines)
- **Bio Operations:** 4 functions (170 lines)

**Total Functions:** 18 functions across 6 domains

---

## New Structure

```
src/database/
├── init.ts           # Database initialization (72 lines)
├── urls.ts           # URL CRUD operations (120 lines)
├── passwords.ts      # Password hashing & verification (60 lines)
├── analytics.ts      # Analytics tracking (50 lines)
├── deletion.ts       # Deletion scheduling (80 lines)
├── bio.ts            # Bio profile operations (180 lines)
└── index.ts          # Barrel export (20 lines)
```

---

## Detailed File Breakdown

### 1. `src/database/init.ts`

**Purpose:** Database table initialization

**Functions to Move:**
- `initializeTables(env: Env): Promise<void>`

**Dependencies:**
- Import `Env` from `../types`
- Import `initializeUsersTable` from `../components/auth/database`

**New Imports Needed:**
- None (self-contained)

**Lines:** ~80 (with JSDoc)

---

### 2. `src/database/urls.ts`

**Purpose:** URL shortening CRUD operations

**Functions to Move:**
- `saveUrlToDatabase(shortcode, url, env, creatorId?, passwordHash?, isPasswordProtected?): Promise<void>`
- `fetchUrlByShortcode(shortcode, env): Promise<string | null>`
- `getUrlFromDatabase(shortcode, env): Promise<string | null>` (alias)
- `deleteUrlByShortcode(shortcode, env): Promise<void>`

**Dependencies:**
- Import `Env` from `../types`
- Import `FILE_SHORTCODE_PREFIX`, `SNIPPET_SHORTCODE_PREFIX` from `../config/constants`

**Special Logic:**
- Line 127-132: Special handling for `19102-` prefixed shortcodes (needs comment explaining why)

**Lines:** ~140 (with JSDoc)

---

### 3. `src/database/passwords.ts`

**Purpose:** Password hashing and verification for shortcodes

**Functions to Move:**
- `isShortcodePasswordProtected(shortcode, env): Promise<boolean>`
- `verifyShortcodePassword(shortcode, password, env): Promise<boolean>`
- ~~`hashPassword(password): Promise<string>`~~ **DEPRECATED** - Use `src/utils/crypto.ts` instead

**Migration Strategy:**
- Mark old `hashPassword()` as deprecated
- Update `verifyShortcodePassword()` to use new crypto utilities
- Add migration note for existing password hashes

**Dependencies:**
- Import `Env` from `../types`
- Import `verifyPassword` from `../utils/crypto`

**Lines:** ~70 (with migration logic)

---

### 4. `src/database/analytics.ts`

**Purpose:** Analytics tracking and retrieval

**Functions to Move:**
- `trackView(request, env, shortcode, redirectUrl): Promise<void>`
- `getAnalytics(shortcode, env): Promise<AnalyticsData[]>`

**Dependencies:**
- Import `Env` from `../types`

**Lines:** ~60 (with JSDoc)

---

### 5. `src/database/deletion.ts`

**Purpose:** Scheduled deletion management

**Functions to Move:**
- `saveDeletionEntry(env, shortcode, deleteTimestamp, isFile): Promise<void>`
- `getDeletionEntries(env): Promise<DeletionEntry[]>`
- `deleteDeletionEntry(env, shortcode): Promise<void>`
- `executeScheduledDeletions(env): Promise<void>`

**Dependencies:**
- Import `Env` from `../types`

**Lines:** ~100 (with JSDoc)

---

### 6. `src/database/bio.ts`

**Purpose:** Bio profile operations

**Functions to Move:**
- `saveBioProfile(env, userId, shortId, title, description, ...): Promise<void>`
- `getBioPage(env, shortcode): Promise<BioProfile | null>`
- `updateBioProfile(env, userId, data): Promise<void>`
- `deleteBioProfile(env, userId): Promise<void>`

**Dependencies:**
- Import `Env` from `../types`

**Lines:** ~200 (with JSDoc)

---

### 7. `src/database/index.ts`

**Purpose:** Barrel export for easy imports

**Content:**
```typescript
/**
 * Database operations module
 * 
 * This module provides all database operations organized by domain.
 * 
 * @module database
 */

// Initialization
export { initializeTables } from './init';

// URL operations
export {
  saveUrlToDatabase,
  fetchUrlByShortcode,
  getUrlFromDatabase,
  deleteUrlByShortcode,
} from './urls';

// Password operations
export {
  isShortcodePasswordProtected,
  verifyShortcodePassword,
} from './passwords';

// Analytics operations
export {
  trackView,
  getAnalytics,
} from './analytics';

// Deletion operations
export {
  saveDeletionEntry,
  getDeletionEntries,
  deleteDeletionEntry,
  executeScheduledDeletions,
} from './deletion';

// Bio operations
export {
  saveBioProfile,
  getBioPage,
  updateBioProfile,
  deleteBioProfile,
} from './bio';

// Deprecated exports (for backward compatibility)
/**
 * @deprecated Use hashPassword from '../utils/crypto' instead
 */
export { hashPassword } from './passwords';
```

**Lines:** ~50

---

## Files That Need Import Updates

### High Priority (Direct Imports)

1. **`src/index.ts`**
   - Current: `import { initializeTables } from './utils/database'`
   - New: `import { initializeTables } from './database'`

2. **`src/routes/api.ts`**
   - Current: `import { saveUrlToDatabase, saveDeletionEntry, hashPassword } from '../utils/database'`
   - New: `import { saveUrlToDatabase, saveDeletionEntry } from '../database'`
   - New: `import { hashPassword } from '../utils/crypto'`

3. **`src/routes/shortcode.ts`**
   - Current: `import { fetchUrlByShortcode, isShortcodePasswordProtected, verifyShortcodePassword, trackView } from '../utils/database'`
   - New: `import { fetchUrlByShortcode, isShortcodePasswordProtected, verifyShortcodePassword, trackView } from '../database'`

4. **`src/routes/admin.ts`**
   - Current: `import { hashPassword } from '../utils/database'`
   - New: `import { hashPassword } from '../utils/crypto'`

5. **`src/routes/bio.ts`**
   - Current: `import { saveBioProfile, getBioPage } from '../utils/database'`
   - New: `import { saveBioProfile, getBioPage } from '../database'`

6. **`src/routes/analytics.ts`**
   - Current: `import { getAnalytics } from '../utils/database'`
   - New: `import { getAnalytics } from '../database'`

7. **`src/helpers/cronDelete.ts`**
   - Current: `import { getDeletionEntries, deleteDeletionEntry } from '../utils/database'`
   - New: `import { getDeletionEntries, deleteDeletionEntry } from '../database'`

### Medium Priority (Indirect Usage)

8. **`src/components/pages/DashboardPage.ts`**
   - May use database functions indirectly
   - Review and update if needed

9. **`src/components/pages/AdminPage.ts`**
   - May use database functions indirectly
   - Review and update if needed

---

## Implementation Steps

### Step 1: Create New Directory Structure
```bash
mkdir src/database
```

### Step 2: Create Individual Module Files

**Order of Creation:**
1. `src/database/init.ts` (no dependencies on other db modules)
2. `src/database/urls.ts` (no dependencies on other db modules)
3. `src/database/passwords.ts` (depends on crypto utils)
4. `src/database/analytics.ts` (no dependencies on other db modules)
5. `src/database/deletion.ts` (no dependencies on other db modules)
6. `src/database/bio.ts` (no dependencies on other db modules)
7. `src/database/index.ts` (barrel export)

### Step 3: Add Comprehensive JSDoc

**Template for Each Function:**
```typescript
/**
 * [Brief description]
 * 
 * @param [paramName] - [Description]
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to [description]
 * 
 * @throws {Error} When [condition]
 * 
 * @example
 * const url = await fetchUrlByShortcode('abc123', env);
 * if (url) {
 *   console.log('Found:', url);
 * }
 * 
 * @remarks
 * [Any special notes, caveats, or implementation details]
 */
```

### Step 4: Update Imports in Existing Files

**Use Find & Replace:**
```
Find: from '../utils/database'
Replace: from '../database'
```

**Manual Updates Needed:**
- `hashPassword` imports → change to `'../utils/crypto'`
- Verify each file compiles after update

### Step 5: Deprecate Old File

**Option A: Keep as Deprecated**
```typescript
// src/utils/database.ts
/**
 * @deprecated This file has been split into domain-specific modules.
 * Import from '../database' instead.
 * 
 * This file will be removed in a future version.
 */

// Re-export everything for backward compatibility
export * from '../database';
```

**Option B: Delete Immediately**
- More aggressive but cleaner
- Requires all imports to be updated first
- Recommended after testing

### Step 6: Testing Checklist

- [ ] All TypeScript files compile without errors
- [ ] Database initialization works
- [ ] URL creation and retrieval works
- [ ] Password-protected shortcodes work
- [ ] Analytics tracking works
- [ ] Scheduled deletions work
- [ ] Bio profiles work
- [ ] No runtime errors in development
- [ ] No runtime errors in production

---

## Migration Guide for Developers

### Before (Old Way)
```typescript
import { 
  saveUrlToDatabase, 
  fetchUrlByShortcode,
  hashPassword 
} from '../utils/database';

// Use functions...
```

### After (New Way)
```typescript
import { 
  saveUrlToDatabase, 
  fetchUrlByShortcode 
} from '../database';
import { hashPassword } from '../utils/crypto';

// Use functions...
```

### Deprecated Functions

**`hashPassword()` from database module:**
```typescript
// ❌ Old (deprecated)
import { hashPassword } from '../utils/database';

// ✅ New (secure)
import { hashPassword } from '../utils/crypto';
```

The new `hashPassword()` uses PBKDF2 with 100,000 iterations instead of plain SHA-256.

---

## Password Hash Migration Strategy

### Problem
Existing shortcode passwords use SHA-256 (weak), new system uses PBKDF2 (strong).

### Solution Options

**Option 1: Gradual Migration (Recommended)**
```typescript
// In verifyShortcodePassword()
async function verifyShortcodePassword(shortcode: string, password: string, env: Env): Promise<boolean> {
  const result = await env.DB.prepare(
    `SELECT password_hash FROM short_urls WHERE shortcode = ?`
  ).bind(shortcode).first();

  if (!result?.password_hash) return false;

  const storedHash = result.password_hash as string;

  // Check if it's new format (contains ':' separator)
  if (storedHash.includes(':')) {
    // New PBKDF2 format
    return await verifyPassword(password, storedHash);
  } else {
    // Old SHA-256 format - verify and upgrade
    const oldHash = await legacyHashPassword(password);
    if (oldHash === storedHash) {
      // Password correct - upgrade to new format
      const newHash = await hashPassword(password);
      await env.DB.prepare(
        `UPDATE short_urls SET password_hash = ? WHERE shortcode = ?`
      ).bind(newHash, shortcode).run();
      return true;
    }
    return false;
  }
}
```

**Option 2: Force Re-hash**
- Invalidate all existing password-protected shortcodes
- Require users to set new passwords
- More secure but disruptive

**Recommendation:** Use Option 1 for seamless migration

---

## Risk Assessment

### Low Risk
- ✅ Creating new files (no impact on existing code)
- ✅ Adding JSDoc comments
- ✅ Barrel exports

### Medium Risk
- ⚠️ Updating imports (could miss some files)
- ⚠️ Password hash migration (needs careful testing)

### High Risk
- ❌ Deleting old `database.ts` before verifying all imports updated

### Mitigation Strategies
1. **Keep old file as deprecated** initially
2. **Test thoroughly** before deleting
3. **Use TypeScript compiler** to find missing imports
4. **Deploy to staging** first
5. **Monitor logs** for errors after deployment

---

## Security Risk Fix ASAP
In admin -> Url Management Tables snippets are being rendered. Sanitize snippets shown in tables.

## Success Criteria

- [ ] All 18 functions moved to appropriate modules
- [ ] All functions have comprehensive JSDoc
- [ ] All imports updated across codebase
- [ ] TypeScript compiles with no errors
- [ ] All tests pass (if tests exist)
- [ ] No runtime errors in development
- [ ] No runtime errors in staging
- [ ] Password migration works seamlessly
- [ ] Old `database.ts` marked as deprecated or deleted
- [ ] Sanitized Table View in Admin
- [ ] Documentation updated

---

## Rollback Plan

If issues arise:

1. **Immediate:** Revert to old `database.ts` by uncommenting re-exports
2. **Short-term:** Keep both old and new files until confident
3. **Long-term:** Fix issues in new modules, then remove old file

---

## Timeline Estimate

- **File Creation:** 1 hour
- **JSDoc Documentation:** 1 hour
- **Import Updates:** 30 minutes
- **Testing:** 1 hour
- **Password Migration:** 30 minutes
- **Total:** 3-4 hours

---

## Next Steps

1. Review this plan
2. Approve or request changes
3. Begin implementation in fresh session
4. Test thoroughly
5. Deploy to staging
6. Monitor and verify
7. Deploy to production

---

**Status:** ✅ Plan Complete - Ready for Implementation  
**Created:** April 4, 2026  
**Phase:** 2 of 5
