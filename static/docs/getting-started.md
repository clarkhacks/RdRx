# Getting Started

This guide will help you get RdRx up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) package manager
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/clarkhacks/RdRx.git
cd RdRx
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and add your configuration:

```env
JWT_SECRET=your-secret-key-here
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_API_KEY=your-mailgun-api-key
SHORT_DOMAIN=localhost:8787
R2_URL=http://localhost:8787/r2
```

### 4. Set Up Cloudflare Resources

Create the required Cloudflare resources:

```bash
# Create D1 database
wrangler d1 create rdrx-db

# Create R2 bucket
wrangler r2 bucket create rdrx-files

# Create KV namespace
wrangler kv:namespace create rdrx-kv
```

Update `wrangler.toml` with the IDs from the output.

### 5. Initialize Database

```bash
wrangler d1 execute rdrx-db --file=./schema.sql
```

### 6. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:8787` to see your RdRx instance!

## Next Steps

- [Deploy to Production](deployment.md)
- [Configure API Keys](api-keys.md)
- [Explore the API](api/README.md)

## Common Issues

### Port Already in Use

If port 8787 is already in use, you can change it in `wrangler.toml`:

```toml
[dev]
port = 3000
```

### Database Not Found

Make sure you've run the database initialization:

```bash
wrangler d1 execute rdrx-db --file=./schema.sql
```

### R2 Bucket Errors

Ensure your R2 bucket is created and properly configured in `wrangler.toml`.

## Getting Help

- Check the [documentation](/)
- [Open an issue](https://github.com/clarkhacks/RdRx/issues)
- [Join discussions](https://github.com/clarkhacks/RdRx/discussions)
