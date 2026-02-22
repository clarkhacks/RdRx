# Production Deployment Checklist

This document provides a comprehensive checklist for deploying RdRx to production.

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] **Update `wrangler.toml`**
  - [ ] Set correct `name` for your worker
  - [ ] Update `FRONTEND_URL` to your production domain
  - [ ] Update `SHORT_DOMAIN` to your production domain
  - [ ] Update `MAILGUN_DOMAIN` to your email domain
  - [ ] Update `FROM_EMAIL` to your sender email
  - [ ] Update `R2_URL` to your CDN domain
  - [ ] Set `DISABLE_SIGNUPS` as needed (true/false)
  - [ ] Verify D1 database binding and ID
  - [ ] Verify KV namespace binding and ID
  - [ ] Verify R2 bucket binding and name

### 2. Secrets Configuration

Set all required secrets using Wrangler CLI:

```bash
# Required secrets
npx wrangler secret put JWT_SECRET
npx wrangler secret put MAILGUN_API_KEY
npx wrangler secret put API_KEY
npx wrangler secret put API_KEY_ADMIN
npx wrangler secret put ADMIN_UID
```

**Important:** Generate strong, random values for:
- `JWT_SECRET`: At least 32 characters, cryptographically random
- `API_KEY`: Unique API key for general operations
- `API_KEY_ADMIN`: Separate admin API key

### 3. Database Setup

- [ ] **Create D1 Database**
  ```bash
  npx wrangler d1 create rdrx-shorturls
  ```

- [ ] **Run Database Migrations**
  ```bash
  npx wrangler d1 execute rdrx-shorturls --file=./schema.sql
  ```

- [ ] **Verify Tables Created**
  - short_urls
  - analytics
  - deletions
  - users
  - sessions

### 4. Storage Setup

- [ ] **Create R2 Bucket**
  ```bash
  npx wrangler r2 bucket create rdrx-files
  ```

- [ ] **Create KV Namespace**
  ```bash
  npx wrangler kv:namespace create KV_RDRX
  npx wrangler kv:namespace create KV_RDRX --preview
  ```

- [ ] **Configure R2 Custom Domain** (optional but recommended)
  - Set up custom domain in Cloudflare dashboard
  - Update `R2_URL` in wrangler.toml

### 5. Code Quality

- [ ] **Run Tests**
  ```bash
  npm run test
  ```

- [ ] **Format Code**
  ```bash
  npm run format
  ```

- [ ] **Build CSS**
  ```bash
  npm run build:css
  ```

- [ ] **Type Check**
  ```bash
  npx tsc --noEmit
  ```

### 6. Security Review

- [ ] Remove all `console.log` statements from production code
- [ ] Verify all API endpoints require authentication where needed
- [ ] Check that admin endpoints verify `ADMIN_UID`
- [ ] Ensure password hashing is using PBKDF2 with salt
- [ ] Verify JWT tokens are using HTTP-only cookies
- [ ] Check CORS settings are appropriate
- [ ] Review file upload size limits
- [ ] Verify input validation on all forms

### 7. Performance Optimization

- [ ] Minify CSS (done via build:css)
- [ ] Verify cron job is configured for cleanup
- [ ] Check database indexes are in place
- [ ] Review R2 storage usage and cleanup policies

### 8. Documentation

- [ ] Update README.md with production URLs
- [ ] Document any custom configuration
- [ ] Update CHANGELOG.md with release notes
- [ ] Create admin user documentation

## Deployment Steps

### 1. Final Build

```bash
# Build CSS
npm run build:css

# Build static site (if using)
npm run build:site

# Verify build
npm run build
```

### 2. Deploy to Cloudflare Workers

```bash
# Deploy to production
npm run deploy
```

### 3. Verify Deployment

- [ ] Visit your production URL
- [ ] Test user registration (if enabled)
- [ ] Test user login
- [ ] Test URL shortening
- [ ] Test file upload
- [ ] Test code snippet creation
- [ ] Test bio page creation
- [ ] Test analytics tracking
- [ ] Test admin panel access
- [ ] Test password reset email

### 4. Create Admin User

```bash
# Option 1: Register through UI, then set ADMIN_UID
# 1. Register a new account
# 2. Get your UID from account page
# 3. Set as secret: npx wrangler secret put ADMIN_UID

# Option 2: Create directly via admin API (requires API_KEY_ADMIN)
```

### 5. Configure Custom Domain (Optional)

- [ ] Add custom domain in Cloudflare Workers dashboard
- [ ] Update DNS records
- [ ] Verify SSL certificate
- [ ] Test custom domain access

### 6. Set Up Monitoring

- [ ] Enable Workers Analytics in Cloudflare dashboard
- [ ] Set up error notifications
- [ ] Configure log retention
- [ ] Set up uptime monitoring (external service)

## Post-Deployment

### 1. Smoke Tests

- [ ] Create a test short URL
- [ ] Upload a test file
- [ ] Create a test snippet
- [ ] Create a test bio page
- [ ] Verify analytics are tracking
- [ ] Test password-protected content
- [ ] Test expiration dates

### 2. Performance Monitoring

- [ ] Check response times in Workers Analytics
- [ ] Monitor D1 database performance
- [ ] Monitor R2 storage usage
- [ ] Monitor KV namespace usage

### 3. Security Monitoring

- [ ] Review authentication logs
- [ ] Check for failed login attempts
- [ ] Monitor API usage
- [ ] Review admin panel access logs

## Rollback Plan

If issues occur after deployment:

```bash
# Rollback to previous version
npx wrangler rollback

# Or deploy a specific version
git checkout <previous-tag>
npm run deploy
```

## Maintenance

### Regular Tasks

- **Daily**: Monitor error logs and analytics
- **Weekly**: Review storage usage and cleanup
- **Monthly**: Review user accounts and content
- **Quarterly**: Security audit and dependency updates

### Database Maintenance

```bash
# Backup database (export to JSON)
npx wrangler d1 export rdrx-shorturls --output=backup.sql

# Clean up expired entries (runs automatically via cron)
# Manual trigger if needed via admin panel
```

### Storage Cleanup

- Expired files are automatically deleted by cron job
- Review orphaned files periodically
- Monitor R2 storage costs

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Verify domain configuration

2. **File uploads failing**
   - Check R2 bucket permissions
   - Verify R2_URL is correct
   - Check file size limits

3. **Emails not sending**
   - Verify MAILGUN_API_KEY is set
   - Check MAILGUN_DOMAIN configuration
   - Verify FROM_EMAIL is authorized

4. **Admin panel not accessible**
   - Verify ADMIN_UID matches your user ID
   - Check that you're logged in
   - Verify admin routes are deployed

## Support

For issues or questions:
- Check [README.md](README.md) for setup instructions
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub
- Check Cloudflare Workers documentation

---

**Last Updated**: 2026-02-22
**Version**: 1.2.1
