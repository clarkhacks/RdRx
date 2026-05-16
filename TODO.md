# 🚀 RdRx Development Roadmap

This document outlines the tasks, improvements, and exciting features planned for RdRx. Feel free to pick a task and contribute!

---

## 🎯 Current Priorities

### 🧹 Codebase Cleanup

- [x] **Organize the file structure** (Phase 1, 2 & 3 Complete)
  - ✅ Created `src/config/` for centralized constants
  - ✅ Created `src/errors/` for error class hierarchy
  - ✅ Created `src/middleware/` for CORS and error handling
  - ✅ Created `src/validation/` for input validation
  - ✅ Database already modular in `src/database/`
  - ✅ Phase 3: Split large route files (customAuth.ts, admin.ts, bio.ts)
    - ✅ Split `customAuth.ts` into `src/routes/auth/` (api.ts, pages.ts, index.ts)
    - ✅ Split `admin.ts` into `src/routes/admin/` (users.ts, urls.ts, stats.ts, email.ts, index.ts)
    - ✅ Split `bio.ts` into `src/routes/bio/` (handlers.ts, upload.ts, index.ts)
  - [ ] Phase 4: Refactor large UI components
- [ ] **Remove unused or redundant files**
  - Identify and delete files that are no longer needed
  - Consolidate similar files to reduce duplication

### 🎨 Template and Routing System

- [ ] **Create a better template system**
  - Standardize templates for pages and components
  - Ensure templates are reusable and easy to extend

### 🧪 Testing & Performance

- [ ] **Add unit tests**
  - Write tests for critical components and functions
  - Ensure high test coverage across the codebase
- [ ] **Optimize performance**
  - Identify and address performance bottlenecks
  - Minify and bundle assets for faster load times

---

## 🧠 Smart & Next-Level Features

### 📱 Smart Links

- [ ] **Device-aware redirects**
  - Detect device type and redirect accordingly (mobile vs. desktop)
  - App Store vs. Google Play automatic routing
- [ ] **Time-based routing**
  - Auto-expire or route differently during certain hours or days
  - Schedule link activation/deactivation

### 🌳 Link Trees / Bio Pages

- [x] **Micro landing pages** (Completed May 2026)
  - ✅ Users can create and edit bio pages (Linktree-style)
  - ✅ Drag-and-drop link reordering
  - ✅ Live preview panel with phone mockup
  - ✅ Toggle switches for link visibility
  - ✅ Collapsible SEO settings
  - ✅ Custom branding and personalization options
  - ✅ Social media integration (contact buttons)
  - ✅ Add themes and color customization (8 themes available)
  - ✅ Add theme selector to bio editor UI
  - [ ] Add analytics for bio page views

### 🔐 Encrypted Pastebin / FileVault

- [ ] **End-to-end encryption**
  - Client-side encrypted file and code storage
  - Zero-knowledge model with separate key sharing
  - File integrity validation with digital signatures

### 🔌 Browser Extensions

- [ ] **Chrome/Firefox extension**
  - Right-click any URL, file, or selected text to instantly RdRx it
  - Quick access toolbar integration
- [ ] **VSCode plugin**
  - One-click snippet sharing from code editor
  - Syntax highlighting preservation

### 📊 Auditable Logs / Receipts

- [ ] **Access tracking**
  - Generate "receipts" showing who viewed/downloaded and when
  - Digital signatures for file integrity validation
  - Audit trails for compliance

### ⏰ Time Capsules

- [ ] **Future activation**
  - Set messages, files, or links that only unlock in the future
  - Public, private, or code-protected time capsules
  - Scheduled content delivery

### 🔄 Campaign / Link Rotator

- [ ] **Multi-destination routing**
  - One short URL, multiple destinations with rotation
  - A/B testing capabilities
  - Time, device, or random-based routing

### 📧 Email Verify Links
- [ ] Emai Required Links
  - Allow user to enter emails that can view the link
  - Unauthed link (not emailed to that email) must enter their email, email must be on the list, receive a code, and then be allowed to view.

### 🕰️ Wayback Machine Integration

- [ ] **Historical snapshots**
  - Archive linked content automatically
  - Prove what a site looked like at a certain time
  - Integration with Internet Archive

---

## 🔐 Privacy & Trust Enhancements

### ⚰️ Dead Man's Switch

- [ ] **Automated expiration**
  - Links/files expire if owner doesn't check in
  - Keep-alive mechanism with configurable intervals
  - Emergency contact auto-notification

### 🛡️ Advanced Security

- [ ] **Two-factor authentication**
  - TOTP support for account security
  - Backup codes and recovery options
- [ ] **Content scanning**
  - Malware detection for uploaded files
  - URL reputation checking
  - Automated content moderation

---

## 🎨 User Experience Improvements

### 📱 Mobile App

- [ ] **Native mobile applications**
  - iOS and Android apps for quick sharing
  - Camera integration for instant QR code generation
  - Offline mode with sync capabilities

### 🎯 Analytics Dashboard

- [ ] **Advanced analytics**
  - Geographic click distribution
  - Device and browser statistics
  - Real-time monitoring dashboard
  - Export capabilities (CSV, JSON, PDF)

### 🌍 Internationalization

- [ ] **Multi-language support**
  - Translate interface to multiple languages
  - RTL language support
  - Localized date/time formats

---

## 🔧 Technical Enhancements

### 📡 API Improvements

- [ ] **Webhook support**
  - Event-driven integrations
  - Custom callback URLs
  - Retry mechanisms

### 🔌 Third-party Integrations

- [ ] **Social media platforms**
  - Direct sharing to Twitter, Facebook, LinkedIn
  - Social media preview optimization

---

## 📚 Documentation & Community

### 📖 Developer Resources

- [ ] **API documentation**
  - Interactive API explorer
  - Code examples in multiple languages
  - SDK development
- [ ] **Plugin development guide**
  - Extension API documentation
  - Community plugin marketplace

### 🤝 Community Features

- [ ] **Public gallery**
  - Showcase of creative uses
  - Community-submitted templates
  - Featured content highlighting

---

## ✅ Completed Tasks

### 📚 Documentation

- [x] **Improve project documentation**
  - ✅ Added detailed descriptions for key components and modules
  - ✅ Documented the purpose and usage of utility functions
- [x] **Enhance setup instructions**
  - ✅ Provided clear, step-by-step instructions for setting up the project locally
  - ✅ Included troubleshooting tips for common issues

### 🛣️ Routing System

- [x] **Improve the routing system**
  - ✅ Refactored routes for better maintainability and scalability
  - ✅ Added support for dynamic routes

### 🎨 TailwindCSS Integration

- [x] **Build TailwindCSS files locally** [See [PR #10](https://github.com/clarkhacks/RdRx/pull/10)]
  - ✅ Replaced TailwindCSS CDN with locally built files
  - ✅ Added build process using PostCSS
  - ✅ Optimized Tailwind configuration for production

### ⚙️ Configuration and Environment Variables

- [x] **Make the domain configurable**
  - ✅ Added domain as environment variable
  - ✅ Created general configuration file for settings (domain, brand name, logo, etc.)
- [x] **Document configuration options**
  - ✅ Provided examples and explanations for each configuration option

### 🎨 UI/UX Improvements (May 2026)

- [x] **Bio page redesign**
  - ✅ Linktree-style interface with live preview
  - ✅ Drag-and-drop link management
  - ✅ Mobile-responsive design
- [x] **Analytics improvements**
  - ✅ Fixed table overflow on mobile
  - ✅ Card-based layout for small screens
  - ✅ Responsive design across all devices
- [x] **Real-time validation**
  - ✅ Shortcode availability checking
  - ✅ Instant feedback for users
  - ✅ Prevents duplicate shortcode submissions

### 🔧 Code Quality (May 2026)

- [x] **Refactoring Phase 1 & 2**
  - ✅ Centralized constants and configuration
  - ✅ Error class hierarchy
  - ✅ Middleware for CORS and error handling
  - ✅ Validation utilities
  - ✅ Modular database layer
- [x] **Email service migration**
  - ✅ Migrated from Mailgun to Resend API
  - ✅ Improved email deliverability

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

_Last updated: 3 May, 2026_
