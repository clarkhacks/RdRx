# RdRx URL Shortener

A modern, feature-rich URL shortener built with Cloudflare Workers, D1 Database, and R2 Storage.

## Features

- **URL Shortening**: Create short, memorable links for any URL
- **Code Snippets**: Share code snippets with syntax highlighting
- **File Sharing**: Upload and share files securely
- **Analytics**: Track visits to your short links with detailed statistics
- **User Authentication**: Secure access with Clerk authentication
- **Expiration**: Set links to expire after a specific time

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A [Cloudflare](https://www.cloudflare.com/) account
- A [Clerk](https://clerk.dev/) account for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/rdrx-shorturls.git
   cd rdrx-shorturls
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Build the CSS:
   ```bash
   npm run build:css
   # or
   pnpm build:css
   ```

## Configuration

### Cloudflare Setup

1. Log in to your Cloudflare account and create a new Worker:

   ```bash
   npx wrangler login
   ```

2. Create a D1 database:

   ```bash
   npx wrangler d1 create rdrx-shorturls
   ```

3. Create an R2 bucket for file storage:

   ```bash
   npx wrangler r2 bucket create rdrx-files
   ```

4. Update your `wrangler.toml` file with the database and bucket information:

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "rdrx-shorturls"
   database_id = "your-database-id"

   [[r2_buckets]]
   binding = "R2_RDRX"
   bucket_name = "rdrx-files"
   ```

5. Create the database schema:
   ```bash
   npx wrangler d1 execute rdrx-shorturls --file=./schema.sql
   ```

### Clerk Setup

1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.dev/)

2. Configure your application:

   - Set up sign-in methods (email, social providers, etc.)
   - Configure the JWT template with appropriate claims
   - Set up your application URLs

3. Get your API keys from the Clerk Dashboard

4. Create a `.dev.vars` file in the project root with your Clerk keys:
   ```
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

## Development

1. Start the development server with CSS watching:

   ```bash
   npm run dev:all
   # or
   pnpm dev:all
   ```

   This will:

   - Build the CSS file
   - Watch for CSS changes and rebuild automatically
   - Start the Wrangler development server

2. Visit `http://localhost:8787` to see your application

## Deployment

1. Build the CSS for production:

   ```bash
   npm run build:css
   # or
   pnpm build:css
   ```

2. Deploy to Cloudflare Workers:

   ```bash
   npm run deploy
   # or
   pnpm deploy
   ```

3. Set up your environment variables in the Cloudflare Dashboard:
   - CLERK_SECRET_KEY
   - CLERK_PUBLISHABLE_KEY

## Project Structure

```
rdrx-shorturls/
├── src/                  # Source code
│   ├── components/       # UI components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   └── ui/           # UI components
│   ├── helpers/          # Helper functions
│   ├── routes/           # Route handlers
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   ├── index.ts          # Entry point
│   └── types.ts          # TypeScript types
├── static/               # Static assets
│   └── css/              # Compiled CSS
├── test/                 # Tests
├── .dev.vars             # Development environment variables
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── wrangler.toml         # Wrangler configuration
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build:css` - Build the CSS file
- `npm run watch:css` - Watch for CSS changes and rebuild
- `npm run dev:all` - Build CSS, watch for changes, and start the dev server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run test` - Run tests
- `npm run cf-typegen` - Generate TypeScript types for Cloudflare bindings

## Updating Dependencies

After making changes to `package.json` (like adding new dependencies), you need to update the lock file:

```bash
# If using npm
npm install

# If using pnpm
pnpm install
```

This is especially important in CI environments where `--frozen-lockfile` is used by default. Without updating the lock file, you'll get an error like:

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

## Troubleshooting

### CSS not updating

If your CSS changes are not reflected, try:

1. Manually rebuilding the CSS: `npm run build:css`
2. Clearing your browser cache
3. Checking the console for errors

### Deployment issues

If you encounter issues during deployment:

1. Ensure your Wrangler CLI is up to date: `npm install -g wrangler@latest`
2. Verify your Cloudflare authentication: `npx wrangler whoami`
3. Check your `wrangler.toml` configuration
4. Make sure your lock file is up to date: `pnpm install` (without `--frozen-lockfile`)

### Database migrations

To update your database schema:

```bash
npx wrangler d1 execute rdrx-shorturls --file=./migrations/your-migration.sql
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
