#!/bin/bash

# RdRx URL Shortener - One-Click Installation Script
# This script automates the complete setup and deployment of RdRx to Cloudflare

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to generate random string
generate_random() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-${1:-32}
}

# Function to prompt for input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        eval "$var_name=\"\${input:-$default}\""
    else
        read -p "$prompt: " input
        eval "$var_name=\"$input\""
    fi
}

# Function to prompt for secure input
prompt_secure() {
    local prompt="$1"
    local var_name="$2"
    
    read -s -p "$prompt: " input
    echo
    eval "$var_name=\"$input\""
}

print_status "🚀 Welcome to RdRx URL Shortener Installation!"
echo
print_status "This script will:"
echo "  • Clone the RdRx repository"
echo "  • Configure your environment variables"
echo "  • Set up Cloudflare resources (D1, R2, KV)"
echo "  • Deploy your URL shortener"
echo

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists git; then
    print_error "Git is not installed. Please install Git and try again."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js (v16+) and try again."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "Prerequisites check passed!"

# Install or check wrangler
if ! command_exists wrangler; then
    print_status "Installing Wrangler CLI..."
    npm install -g wrangler@latest
else
    print_status "Wrangler CLI found, checking version..."
    wrangler --version
fi

# Check if user is logged in to Cloudflare
print_status "Checking Cloudflare authentication..."
if ! wrangler whoami >/dev/null 2>&1; then
    print_warning "You need to log in to Cloudflare first."
    print_status "Opening browser for Cloudflare login..."
    wrangler login
else
    print_success "Already logged in to Cloudflare!"
fi

# Get installation directory
echo
print_status "📁 Setup Installation Directory"
prompt_with_default "Enter installation directory" "rdrx-shortener" INSTALL_DIR

# Clone repository
if [ -d "$INSTALL_DIR" ]; then
    print_warning "Directory $INSTALL_DIR already exists."
    read -p "Do you want to remove it and continue? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        rm -rf "$INSTALL_DIR"
    else
        print_error "Installation cancelled."
        exit 1
    fi
fi

print_status "Cloning RdRx repository..."
git clone https://github.com/clarkhacks/RdRx.git "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Collect configuration
echo
print_status "🔧 Configuration Setup"

# Basic configuration
prompt_with_default "Project name (for Cloudflare Worker)" "rdrx-shortener" PROJECT_NAME
prompt_with_default "Your domain (e.g., short.example.com)" "" SHORT_DOMAIN
prompt_with_default "CDN URL for static files (e.g., https://cdn.example.com)" "https://cdn.$SHORT_DOMAIN" R2_URL
prompt_with_default "Mailgun domain" "$SHORT_DOMAIN" MAILGUN_DOMAIN
prompt_with_default "From email address" "no-reply@$SHORT_DOMAIN" FROM_EMAIL

# Generate API keys
API_KEY=$(generate_random 32)
API_KEY_ADMIN=$(generate_random 32)
JWT_SECRET=$(generate_random 64)

print_success "Generated secure API keys and JWT secret"

# Secure configuration
echo
print_status "🔐 Secure Configuration"
prompt_secure "Mailgun API Key (get from https://app.mailgun.com/app/sending/domains)" MAILGUN_API_KEY

# Create Cloudflare resources
echo
print_status "☁️  Creating Cloudflare Resources"

# Create D1 database
print_status "Creating D1 database..."
D1_OUTPUT=$(wrangler d1 create "$PROJECT_NAME-db" 2>&1)
DATABASE_ID=$(echo "$D1_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$DATABASE_ID" ]; then
    print_error "Failed to create D1 database. Output: $D1_OUTPUT"
    exit 1
fi
print_success "D1 database created: $DATABASE_ID"

# Create R2 bucket
print_status "Creating R2 bucket..."
if wrangler r2 bucket create "$PROJECT_NAME-files" >/dev/null 2>&1; then
    print_success "R2 bucket created: $PROJECT_NAME-files"
else
    print_warning "R2 bucket might already exist or creation failed"
fi

# Create KV namespaces
print_status "Creating KV namespaces..."
KV_OUTPUT=$(wrangler kv:namespace create "KV_RDRX" 2>&1)
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

KV_PREVIEW_OUTPUT=$(wrangler kv:namespace create "KV_RDRX" --preview 2>&1)
KV_PREVIEW_ID=$(echo "$KV_PREVIEW_OUTPUT" | grep -o 'preview_id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$KV_ID" ] || [ -z "$KV_PREVIEW_ID" ]; then
    print_error "Failed to create KV namespaces"
    exit 1
fi
print_success "KV namespaces created: $KV_ID (preview: $KV_PREVIEW_ID)"

# Update wrangler.toml
print_status "Configuring wrangler.toml..."
cat > wrangler.toml << EOF
#:schema node_modules/wrangler/config-schema.json
name = "$PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2024-12-05"
compatibility_flags = ["nodejs_compat"]

# Static Directory
[assets]
directory = "./static"
binding = "STATIC"

# Vars
[vars]
FRONTEND_URL = "https://$SHORT_DOMAIN"
SHORT_DOMAIN = "$SHORT_DOMAIN"
MAILGUN_DOMAIN = "$MAILGUN_DOMAIN"
FROM_EMAIL = "$FROM_EMAIL"
R2_URL = "$R2_URL"

# Workers Logs
[observability]
enabled = true

[triggers]
# daily cron trigger for cronDelete
crons = ["0 0 * * *"]

[[d1_databases]]
binding = "DB"
database_name = "$PROJECT_NAME-db"
database_id = "$DATABASE_ID"

[[kv_namespaces]]
binding = "KV_RDRX"
id = "$KV_ID"
preview_id = "$KV_PREVIEW_ID"

[[r2_buckets]]
binding = "R2_RDRX"
bucket_name = "$PROJECT_NAME-files"
EOF

# Create .dev.vars for local development
print_status "Creating development environment file..."
cat > .dev.vars << EOF
API_KEY="$API_KEY"
API_KEY_ADMIN="$API_KEY_ADMIN"

# Authentication
JWT_SECRET="$JWT_SECRET"
MAILGUN_DOMAIN="$MAILGUN_DOMAIN"
MAILGUN_API_KEY="$MAILGUN_API_KEY"
FROM_EMAIL="$FROM_EMAIL"
FRONTEND_URL="http://localhost:8787"
SHORT_DOMAIN="$SHORT_DOMAIN"
ADMIN_UID=""
R2_URL="$R2_URL"
EOF

# Set Cloudflare secrets
print_status "Setting Cloudflare Worker secrets..."
echo "$API_KEY" | wrangler secret put API_KEY
echo "$API_KEY_ADMIN" | wrangler secret put API_KEY_ADMIN
echo "$JWT_SECRET" | wrangler secret put JWT_SECRET
echo "$MAILGUN_API_KEY" | wrangler secret put MAILGUN_API_KEY

print_success "Secrets configured successfully!"

# Initialize database
print_status "Initializing database schema..."
cat > schema.sql << 'EOF'
-- Create short_urls table
CREATE TABLE IF NOT EXISTS short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  creator_id TEXT,
  is_snippet BOOLEAN NOT NULL DEFAULT 0,
  is_file BOOLEAN NOT NULL DEFAULT 0,
  password_hash TEXT,
  is_password_protected BOOLEAN NOT NULL DEFAULT 0
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
  email_verified BOOLEAN NOT NULL DEFAULT 0,
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
EOF

wrangler d1 execute "$PROJECT_NAME-db" --file=./schema.sql
print_success "Database schema initialized!"

# Deploy the application
print_status "🚀 Deploying to Cloudflare..."
npm run deploy

print_success "Deployment completed!"

# Final instructions
echo
print_success "🎉 Installation Complete!"
echo
print_status "Your RdRx URL Shortener is now deployed and ready to use!"
echo
echo "📋 Important Information:"
echo "  • Your app URL: https://$PROJECT_NAME.$(wrangler whoami | grep 'Account ID' | awk '{print $3}').workers.dev"
echo "  • Custom domain: https://$SHORT_DOMAIN (configure DNS to point to your worker)"
echo "  • API Key: $API_KEY"
echo "  • Admin API Key: $API_KEY_ADMIN"
echo
echo "🔧 Next Steps:"
echo "  1. Configure your DNS to point $SHORT_DOMAIN to your Cloudflare Worker"
echo "  2. Create your first user account through the web interface"
echo "  3. Set the ADMIN_UID secret with your user ID to access admin features:"
echo "     wrangler secret put ADMIN_UID"
echo "  4. Configure your R2 bucket for public access if needed"
echo
echo "📁 Project files are located in: $(pwd)"
echo "🔧 Local development: npm run dev"
echo "🚀 Redeploy: npm run deploy"
echo
print_status "For support and documentation, visit: https://github.com/clarkhacks/RdRx"

# Save installation info
cat > INSTALLATION_INFO.txt << EOF
RdRx Installation Information
============================

Installation Date: $(date)
Project Name: $PROJECT_NAME
Domain: $SHORT_DOMAIN
Database ID: $DATABASE_ID
KV Namespace ID: $KV_ID
KV Preview ID: $KV_PREVIEW_ID
R2 Bucket: $PROJECT_NAME-files

API Key: $API_KEY
Admin API Key: $API_KEY_ADMIN

Worker URL: https://$PROJECT_NAME.$(wrangler whoami | grep 'Account ID' | awk '{print $3}').workers.dev
Custom Domain: https://$SHORT_DOMAIN

To set admin user:
wrangler secret put ADMIN_UID

Local development:
npm run dev

Deploy:
npm run deploy
EOF

print_success "Installation information saved to INSTALLATION_INFO.txt"
