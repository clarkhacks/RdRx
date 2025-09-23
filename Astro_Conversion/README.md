# RdRx Astro Conversion

This is the Astro conversion of the RdRx URL shortener application, designed to run on Cloudflare Pages with the same functionality as the original Cloudflare Workers version.

## Project Structure

```
Astro_Conversion/
├── src/
│   ├── components/          # Astro components
│   │   ├── Header.astro     # Main header component
│   │   └── Sidebar.astro    # Navigation sidebar
│   ├── layouts/             # Page layouts
│   │   ├── BaseLayout.astro # Base HTML layout
│   │   └── PageLayout.astro # Main page layout with header/sidebar
│   ├── pages/               # Astro pages (file-based routing)
│   │   ├── index.astro      # Landing page
│   │   └── dashboard.astro  # User dashboard
│   ├── middleware/          # Astro middleware
│   │   └── index.ts         # Authentication middleware
│   ├── utils/               # Utility functions
│   │   └── database.ts      # Database operations
│   ├── types/               # TypeScript type definitions
│   │   └── env.ts           # Environment types
│   └── env.d.ts            # Astro environment declarations
├── public/                  # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
├── wrangler.toml           # Cloudflare configuration
└── README.md               # This file
```

## Features

The Astro conversion maintains all the functionality of the original application:

- **URL Shortening**: Create short, memorable links
- **Analytics**: Track clicks and user engagement
- **Bio Pages**: Create custom bio pages with multiple links
- **File Sharing**: Upload and share files with expiration
- **User Authentication**: Secure login and user management
- **Admin Panel**: Administrative controls and user management

## Technology Stack

- **Astro**: Modern web framework with server-side rendering
- **Cloudflare Pages**: Hosting and edge computing platform
- **Cloudflare D1**: SQLite database at the edge
- **Cloudflare R2**: Object storage for files
- **Cloudflare KV**: Key-value storage for sessions
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Cloudflare account with Wrangler CLI

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your configuration
```

3. Initialize the database:
```bash
wrangler d1 create rdrx-astro
# Update wrangler.toml with the database ID
```

4. Run database migrations:
```bash
wrangler d1 execute rdrx-astro --local --file=./migrations/init.sql
```

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:4321`

### Testing the Login System

1. **Initialize the database** (first time only):
   ```bash
   curl -X POST http://localhost:4321/api/init-db
   ```

2. **Create a test user**:
   ```bash
   curl -X POST http://localhost:4321/api/create-test-user
   ```
   This creates a user with:
   - Email: `test@example.com`
   - Password: `password123`

3. **Test the login**:
   - Visit `http://localhost:4321/login`
   - Use the test credentials above
   - Should redirect to `/dashboard` on success

4. **Test authentication**:
   - Visit `http://localhost:4321/api/auth/me` to check current user
   - Visit `http://localhost:4321/dashboard` to see the protected dashboard

### Building and Deployment

1. Build the application:
```bash
pnpm build
```

2. Deploy to Cloudflare Workers:
```bash
pnpm deploy
```

## Configuration

### Environment Variables

Configure these variables in your `.dev.vars` file for local development and in Cloudflare Pages settings for production:

- `FRONTEND_URL`: Your domain URL
- `SHORT_DOMAIN`: Domain for short links
- `MAILGUN_API_KEY`: For email functionality
- `JWT_SECRET`: For session management
- `DISABLE_SIGNUPS`: Set to "true" to disable new registrations

### Cloudflare Bindings

The application requires these Cloudflare bindings (configured in `wrangler.toml`):

- `DB`: D1 database binding
- `KV_RDRX`: KV namespace for sessions
- `R2_RDRX`: R2 bucket for file storage

## Migration from Workers

This Astro version is designed to be a drop-in replacement for the original Cloudflare Workers version. Key differences:

1. **File-based routing**: Pages are now in `src/pages/` instead of route handlers
2. **Component architecture**: UI is now built with Astro components
3. **SSR by default**: Server-side rendering for better SEO and performance
4. **Middleware**: Authentication handled via Astro middleware

## API Routes

API routes will be implemented as Astro endpoints in `src/pages/api/`:

- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management
- `/api/admin/*` - Admin functionality
- `/api/bio/*` - Bio page management
- `/api/analytics/*` - Analytics data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.
