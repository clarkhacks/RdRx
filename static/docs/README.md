# RdRx Documentation

> A modern, feature-rich URL shortener built on Cloudflare Workers

## Welcome

Welcome to the RdRx documentation! This guide will help you understand, deploy, and contribute to RdRx.

## What is RdRx?

RdRx is a powerful URL shortener service built on Cloudflare's edge network. It provides:

- **URL Shortening** - Create short, memorable links
- **Code Snippets** - Share code snippets with syntax highlighting
- **File Sharing** - Upload and share files securely
- **Bio Pages** - Create custom landing pages (like Linktree)
- **Analytics** - Track link performance and visitor data
- **Password Protection** - Secure your links with passwords
- **Scheduled Deletion** - Auto-delete links after a specified time
- **API Access** - Programmatic access via REST API

## Quick Links

- [Getting Started](getting-started.md)
- [Deployment Guide](deployment.md)
- [API Documentation](api/README.md)
- [Development Guide](development/README.md)
- [Contributing](contributing.md)

## Features

### 🔗 URL Shortening
Create short, memorable links that redirect to any URL. Perfect for sharing on social media, emails, or anywhere character count matters.

### 💻 Code Snippets
Share code snippets with automatic syntax highlighting. Supports multiple programming languages and file formats.

### 📁 File Sharing
Upload and share files securely using Cloudflare R2 storage. Set expiration dates for automatic cleanup.

### 🎨 Bio Pages
Create beautiful landing pages with multiple links, social media connections, and custom themes.

### 📊 Analytics
Track link performance with detailed analytics including:
- Total visits
- Geographic distribution
- Visit trends over time
- Referrer information

### 🔐 Security
- Password-protected links
- PBKDF2 password hashing
- API key authentication
- Rate limiting
- CORS protection

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Cache**: Cloudflare KV
- **Language**: TypeScript
- **Build Tool**: Wrangler

## Architecture

RdRx follows a modular architecture with clear separation of concerns:

```
src/
├── database/       # Database operations by domain
├── routes/         # HTTP route handlers
├── components/     # UI components and pages
├── middleware/     # Request/response middleware
├── validation/     # Input validation
├── errors/         # Custom error classes
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

## Getting Help

- 📖 [Read the docs](/)
- 🐛 [Report issues](https://github.com/clarkhacks/RdRx/issues)
- 💬 [Discussions](https://github.com/clarkhacks/RdRx/discussions)
- 📧 [Contact support](mailto:support@rdrx.co)

## License

RdRx is open source software licensed under the [MIT License](https://github.com/clarkhacks/RdRx/blob/main/LICENSE).
