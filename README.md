# RdRx URL Shortener

<div align="center">
  <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" width="120" height="120">
  <h1>RdRx</h1>
  <p><strong>Modern URL Shortening & Content Sharing</strong></p>
</div>

> **Note:** This project is in early development. Some features may require tinkering to work properly in your environment.

## Features

- **URL Shortening**: Create short, memorable links for any URL
- **Code Snippets**: Share code snippets with syntax highlighting
- **File Sharing**: Upload and share files securely
- **Analytics**: Track visits to your short links with detailed statistics
- **Custom Authentication**: Secure server-side authentication with JWT tokens
- **User Dashboard**: View your links, snippets, files, and analytics
- **Account Management**: Profile editing, password management, and profile pictures
- **Expiration**: Set links to expire after a specific time

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A [Cloudflare](https://www.cloudflare.com/) account

## Step-by-Step Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/clarkhacks/RdRx.git
cd RdRx
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Cloudflare Setup

#### 3.1. Log in to Cloudflare

```bash
npx wrangler login
```

Follow the prompts to authenticate with your Cloudflare account.

#### 3.2. Create a D1 Database

```bash
npx wrangler d1 create rdrx-shorturls
```

This will output a database ID. Copy this ID for the next step.

#### 3.3. Create an R2 Bucket

```bash
npx wrangler r2 bucket create rdrx-files
```

#### 3.4. Create a KV Namespace

```bash
npx wrangler kv:namespace create KV_RDRX
npx wrangler kv:namespace create KV_RDRX --preview
```

Copy the IDs from these commands for the next step.

### 4. Configure Your Project

#### 4.1. Update wrangler.toml

Edit your `wrangler.toml` file to include the database, bucket, and KV namespace information:

```toml
name = "rdrx"
main = "src/index.ts"
compatibility_date = "2024-12-05"
compatibility_flags = ["nodejs_compat"]

[vars]
FRONTEND_URL = "http://localhost:8787"
MAILGUN_DOMAIN = "your-domain.com"
FROM_EMAIL = "no-reply@your-domain.com"

[observability]
enabled = true

[triggers]
crons = ["0 0 * * *"]

[[d1_databases]]
binding = "DB"
database_name = "rdrx-shorturls"
database_id = "YOUR_DATABASE_ID" # Replace with your actual database ID

[[kv_namespaces]]
binding = "KV_RDRX"
id = "YOUR_KV_NAMESPACE_ID" # Replace with your actual KV namespace ID
preview_id = "YOUR_KV_NAMESPACE_PREVIEW_ID" # Replace with your actual preview ID

[[r2_buckets]]
binding = "R2_RDRX"
bucket_name = "rdrx-files"
```

#### 4.2. Set Up Environment Variables

Create a `.dev.vars` file in the project root with your configuration:

```
API_KEY="your-api-key-here"
API_KEY_ADMIN="your-admin-api-key-here"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_API_KEY="key-1234567890abcdef1234567890abcdef"
FROM_EMAIL="noreply@your-domain.com"
FRONTEND_URL="http://localhost:8787"
```

### 5. Initialize the Database

Create a file called `schema.sql` in the project root with the following content:

```sql
-- Create short_urls table
CREATE TABLE IF NOT EXISTS short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  creator_id TEXT,
  is_snippet BOOLEAN NOT NULL DEFAULT 0,
  is_file BOOLEAN NOT NULL DEFAULT 0
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT NOT NULL,
  target_url TEXT NOT NULL,
  country TEXT,
  timestamp TEXT NOT NULL
);

-- Create deletions table
CREATE TABLE IF NOT EXISTS deletions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT NOT NULL,
  delete_at INTEGER NOT NULL,
  is_file BOOLEAN NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  profile_picture_url TEXT
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
```

Then run:

```bash
npx wrangler d1 execute rdrx-shorturls --file=./schema.sql
```

### 6. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:8787` to see your application.

### 7. Deploy to Production

```bash
npm run deploy
# or
pnpm deploy
```

For production, set your environment variables in the Cloudflare Dashboard or using Wrangler:

```bash
npx wrangler secret put JWT_SECRET
npx wrangler secret put MAILGUN_API_KEY
# etc.
```

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Check that your JWT_SECRET is properly set in your environment variables
2. Ensure cookies are being properly set (check browser dev tools)
3. Verify that your R2 bucket is properly configured for profile picture uploads
4. Check server logs for detailed error messages

### Database Issues

If you encounter database issues:

1. Verify your D1 database is properly configured in wrangler.toml
2. Check that all tables were created successfully
3. Try running the schema.sql file again to ensure all tables exist

### Deployment Issues

If you encounter issues during deployment:

1. Ensure your Wrangler CLI is up to date: `npm install -g wrangler@latest`
2. Verify your Cloudflare authentication: `npx wrangler whoami`
3. Check your `wrangler.toml` configuration
4. Make sure all required environment variables are set

## Project Structure

```
rdrx-shorturls/
├── src/                  # Source code
│   ├── components/       # UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   └── ui/           # UI components
│   ├── helpers/          # Helper functions
│   ├── middleware/       # Middleware functions
│   ├── routes/           # Route handlers
│   ├── utils/            # Utility functions
│   ├── index.ts          # Entry point
│   └── types.ts          # TypeScript types
├── test/                 # Tests
├── .dev.vars             # Development environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── wrangler.toml         # Wrangler configuration
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run test` - Run tests
- `npm run cf-typegen` - Generate TypeScript types for Cloudflare bindings
- `npm run format` - Format code with Prettier

## Authentication System

The application uses a custom server-side authentication system with the following features:

- **JWT Tokens**: Secure authentication using JSON Web Tokens
- **HTTP-Only Cookies**: Tokens are stored in secure, HTTP-only cookies for maximum security
- **Password Hashing**: PBKDF2 with salt for secure password storage
- **Account Management**: Users can update their profile, change passwords, and upload profile pictures
- **Email Integration**: Password reset via email using Mailgun

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.
