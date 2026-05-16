# Changelog

All notable changes to RdRx will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Bio Page Themes**: 8 beautiful color themes for bio pages (Classic Beige, Dark Mode, Ocean Blue, Sunset Orange, Forest Green, Midnight Purple, Minimal White, Candy Pink)
- **Theme Selector**: Dropdown in bio editor to choose page theme with live preview
- **SEO Noindex Option**: "Don't show in search results" checkbox to add noindex meta tag to bio pages
- **Live Theme Preview**: Real-time theme switching in bio editor preview panel

### Changed
- **Route Organization**: Split large route files into modular subdirectories for better maintainability
  - `src/routes/customAuth.ts` → `src/routes/auth/` (api.ts, pages.ts, index.ts)
  - `src/routes/admin.ts` → `src/routes/admin/` (users.ts, urls.ts, stats.ts, email.ts, index.ts)
  - `src/routes/bio.ts` → `src/routes/bio/` (handlers.ts, upload.ts, index.ts)
- **Bio Page Styling**: Dynamic theme application based on user selection
- **Code Organization**: Improved maintainability with smaller, focused modules (average file size reduced from 600+ to 100-400 lines)

### Fixed
- **Theme Persistence**: Themes now properly save and load from database
- **Theme Preview**: Live preview accurately reflects selected theme colors

## [1.2.2] - 2026-05-03

### Added
- Production-ready logging utility (`src/utils/logger.ts`) for better error tracking
- CHANGELOG.md for tracking version history
- Comprehensive UI improvements with unified design system
- Bio page editor with drag-and-drop link management and live preview
- File gallery management with R2 storage integration
- Admin panel for user and content management
- Profile picture upload functionality
- Password reset via email
- Analytics tracking and visualization
- Custom authentication system with JWT tokens
- Real-time shortcode availability checking for all forms
- Centralized constants in `src/config/constants.ts`
- Error class hierarchy (`src/errors/`) for consistent error handling
- CORS middleware (`src/middleware/cors.ts`)
- Error handler middleware (`src/middleware/errorHandler.ts`)
- Validation utilities (`src/validation/`) for URLs, shortcodes, and auth

### Changed
- Improved README.md with better structure and clearer instructions
- Updated UI components to use shared design system
- Simplified form interactions across the application
- Enhanced mobile responsiveness across all pages
- Improved error handling and validation
- Bio page route changed from `/bio/edit` to `/bio` for better UX
- Bio page redesigned as Linktree-style interface with live preview panel
- Analytics table now fully responsive with card layout on mobile
- Migrated email service from Mailgun to Resend API
- Refactored database layer into modular files (`src/database/`)

### Fixed
- Typo in `.dev.vars.example` (htps -> https)
- Removed redundant `loginForm.ts` file (consolidated into `auth/LoginForm.ts`)
- Consistent styling across all components
- Better error messages for user feedback
- Analytics table overflow issues on mobile devices
- TypeScript compilation errors in error classes

### Security
- Implemented secure password hashing with PBKDF2 and salt
- HTTP-only cookies for session management
- JWT-based authentication
- Input validation and sanitization
- Unified crypto utilities for consistent security practices

## [1.2.1] - 2025-05-29

### Added
- TailwindCSS local build process
- PostCSS configuration for optimized CSS
- Configurable domain settings via environment variables

### Changed
- Replaced TailwindCSS CDN with locally built files
- Improved routing system for better maintainability
- Enhanced documentation with step-by-step setup guide

### Fixed
- Various bug fixes and performance improvements

## [1.2.0] - 2025-05-15

### Added
- Bio pages / Link trees functionality
- File upload and sharing capabilities
- Password protection for links, snippets, and files
- Content editing after creation
- User dashboard with analytics

### Changed
- Improved database schema with new tables
- Enhanced UI with modern design patterns

## [1.1.0] - 2025-04-01

### Added
- Code snippet sharing with syntax highlighting
- Analytics tracking for short links
- User authentication system
- Account management features

### Changed
- Migrated to Cloudflare D1 database
- Improved error handling

## [1.0.0] - 2025-03-01

### Added
- Initial release
- URL shortening functionality
- Cloudflare Workers deployment
- R2 storage integration
- Basic admin features

---

## Release Notes

### How to Release

1. Update version in `package.json`
2. Update this CHANGELOG.md with release notes
3. Commit changes: `git commit -am "Release v1.x.x"`
4. Create git tag: `git tag -a v1.x.x -m "Version 1.x.x"`
5. Push changes: `git push && git push --tags`
6. Deploy to production: `npm run deploy`

### Version Numbering

- **Major (1.x.x)**: Breaking changes, major new features
- **Minor (x.1.x)**: New features, non-breaking changes
- **Patch (x.x.1)**: Bug fixes, minor improvements
