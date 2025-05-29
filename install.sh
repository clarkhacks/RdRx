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

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists apt-get; then
            echo "ubuntu"
        elif command_exists yum; then
            echo "centos"
        elif command_exists pacman; then
            echo "arch"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Function to install Git
install_git() {
    local os=$(detect_os)
    print_status "Installing Git..."
    
    case $os in
        "ubuntu")
            sudo apt-get update && sudo apt-get install -y git
            ;;
        "centos")
            sudo yum install -y git
            ;;
        "arch")
            sudo pacman -S --noconfirm git
            ;;
        "macos")
            if command_exists brew; then
                brew install git
            else
                print_error "Please install Homebrew first: https://brew.sh"
                print_error "Then run: brew install git"
                exit 1
            fi
            ;;
        "windows")
            print_error "Please install Git from: https://git-scm.com/download/win"
            exit 1
            ;;
        *)
            print_error "Unsupported OS. Please install Git manually."
            exit 1
            ;;
    esac
}

# Function to install Node.js
install_nodejs() {
    local os=$(detect_os)
    print_status "Installing Node.js..."
    
    case $os in
        "ubuntu")
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        "centos")
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo yum install -y nodejs npm
            ;;
        "arch")
            sudo pacman -S --noconfirm nodejs npm
            ;;
        "macos")
            if command_exists brew; then
                brew install node
            else
                print_error "Please install Homebrew first: https://brew.sh"
                print_error "Then run: brew install node"
                exit 1
            fi
            ;;
        "windows")
            print_error "Please install Node.js from: https://nodejs.org/en/download/"
            exit 1
            ;;
        *)
            print_error "Unsupported OS. Please install Node.js manually from: https://nodejs.org"
            exit 1
            ;;
    esac
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

# Check Git
if ! command_exists git; then
    print_warning "Git is not installed."
    read -p "Would you like to install Git now? (y/N): " install_git_confirm
    if [[ $install_git_confirm =~ ^[Yy]$ ]]; then
        install_git
        if ! command_exists git; then
            print_error "Git installation failed. Please install Git manually and try again."
            exit 1
        fi
        print_success "Git installed successfully!"
    else
        print_error "Git is required. Please install Git and try again."
        exit 1
    fi
fi

# Check Node.js
if ! command_exists node; then
    print_warning "Node.js is not installed."
    read -p "Would you like to install Node.js now? (y/N): " install_node_confirm
    if [[ $install_node_confirm =~ ^[Yy]$ ]]; then
        install_nodejs
        if ! command_exists node; then
            print_error "Node.js installation failed. Please install Node.js manually and try again."
            exit 1
        fi
        print_success "Node.js installed successfully!"
    else
        print_error "Node.js is required. Please install Node.js (v16+) and try again."
        exit 1
    fi
fi

# Check npm (should come with Node.js)
if ! command_exists npm; then
    print_warning "npm is not installed."
    if command_exists node; then
        print_error "Node.js is installed but npm is missing. This is unusual."
        print_error "Please reinstall Node.js from https://nodejs.org"
    else
        print_error "npm requires Node.js. Please install Node.js first."
    fi
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
    print_warning "You need to authenticate with Cloudflare first."
    echo
    print_status "Since this script is running in a non-interactive environment,"
    print_status "you have two options:"
    echo
    echo "Option 1 (Recommended): Use API Token"
    echo "  1. Go to: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
    echo "  2. Create a Custom Token with these permissions:"
    echo "     - Zone:Zone:Read, Account:Cloudflare Workers:Edit"
    echo "     - Zone:Zone Settings:Read, Zone:Zone:Read"
    echo "     - Account:D1:Edit, Account:R2:Edit"
    echo "     - Account:Workers KV Storage:Edit"
    echo "  3. Set the token as an environment variable:"
    echo "     export CLOUDFLARE_API_TOKEN=your_token_here"
    echo "  4. Re-run this script"
    echo
    echo "Option 2: Run script locally"
    echo "  1. Download the script: wget https://raw.githubusercontent.com/clarkhacks/RdRx/main/install.sh"
    echo "  2. Make it executable: chmod +x install.sh"
    echo "  3. Run it: ./install.sh"
    echo "  4. This will allow interactive browser login"
    echo
    read -p "Do you have a CLOUDFLARE_API_TOKEN set? (y/N): " has_token
    if [[ $has_token =~ ^[Yy]$ ]]; then
        if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
            print_warning "CLOUDFLARE_API_TOKEN environment variable is not set in this session."
            print_status "Please enter your Cloudflare API token:"
            read -s -p "API Token: " user_token
            echo
            export CLOUDFLARE_API_TOKEN="$user_token"
        fi
        print_status "Testing API token authentication..."
        # Test the token and check for account selection issues
        WHOAMI_OUTPUT=$(wrangler whoami 2>&1)
        WHOAMI_EXIT_CODE=$?
        
        if [ $WHOAMI_EXIT_CODE -ne 0 ]; then
            if echo "$WHOAMI_OUTPUT" | grep -q "More than one account available"; then
                print_warning "Multiple Cloudflare accounts detected!"
                echo
                echo "Available accounts:"
                echo "$WHOAMI_OUTPUT" | grep -A 10 "Available accounts are"
                echo
                print_status "Please select which account to use:"
                
                # Extract account IDs and names
                # Parse the format: `Account Name`: `account_id`
                ACCOUNTS_RAW=$(echo "$WHOAMI_OUTPUT" | grep -oE '`[^`]+`: `[^`]+`')
                
                # Create numbered list
                i=1
                declare -a ACCOUNT_IDS
                declare -a ACCOUNT_NAMES
                
                while IFS= read -r line; do
                    if [ -n "$line" ]; then
                        # Extract name and ID using more precise regex
                        name=$(echo "$line" | sed -n 's/^`\([^`]*\)`: `[^`]*`$/\1/p')
                        id=$(echo "$line" | sed -n 's/^`[^`]*`: `\([^`]*\)`$/\1/p')
                        
                        # Skip template placeholders and only add valid entries
                        if [ -n "$name" ] && [ -n "$id" ] && [ "$name" != "<name>" ] && [ "$id" != "<account_id>" ]; then
                            echo "$i) $name (ID: $id)"
                            ACCOUNT_NAMES[$i]="$name"
                            ACCOUNT_IDS[$i]="$id"
                            ((i++))
                        fi
                    fi
                done <<< "$ACCOUNTS_RAW"
                
                echo
                read -p "Enter the number of the account you want to use: " account_choice
                
                if [[ "$account_choice" =~ ^[0-9]+$ ]] && [ "$account_choice" -ge 1 ] && [ "$account_choice" -lt "$i" ]; then
                    SELECTED_ACCOUNT_ID="${ACCOUNT_IDS[$account_choice]}"
                    SELECTED_ACCOUNT_NAME="${ACCOUNT_NAMES[$account_choice]}"
                    
                    print_success "Selected account: $SELECTED_ACCOUNT_NAME ($SELECTED_ACCOUNT_ID)"
                    export CLOUDFLARE_ACCOUNT_ID="$SELECTED_ACCOUNT_ID"
                    
                    # Test again with account ID
                    if ! wrangler whoami >/dev/null 2>&1; then
                        print_error "Authentication still failed after setting account ID."
                        exit 1
                    fi
                    print_success "API token authentication successful!"
                else
                    print_error "Invalid selection. Please run the script again."
                    exit 1
                fi
            else
                print_error "API token authentication failed."
                echo "Error output: $WHOAMI_OUTPUT"
                print_error "Please check that your token has the correct permissions:"
                print_error "- Zone:Zone:Read + Account:Cloudflare Workers:Edit"
                print_error "- Zone:Zone Settings:Read + Zone:Zone:Read"
                print_error "- Account:D1:Edit + Account:R2:Edit"
                print_error "- Account:Workers KV Storage:Edit"
                exit 1
            fi
        else
            print_success "API token authentication successful!"
        fi
    else
        print_error "Please set up authentication and try again."
        exit 1
    fi
else
    print_success "Already authenticated with Cloudflare!"
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
echo "You can get your Mailgun API Key from: https://app.mailgun.com/app/sending/domains"
echo "If you don't have Mailgun set up yet, you can press Enter to skip and configure it later."
prompt_with_default "Mailgun API Key (optional)" "" MAILGUN_API_KEY

# Create Cloudflare resources
echo
print_status "☁️  Creating Cloudflare Resources"

# Create D1 database
print_status "Creating D1 database..."
set +e  # Temporarily disable exit on error

# Check if we need to handle account selection again
D1_OUTPUT=$(wrangler d1 create "$PROJECT_NAME-db" 2>&1)
D1_EXIT_CODE=$?

if [ $D1_EXIT_CODE -ne 0 ] && echo "$D1_OUTPUT" | grep -q "More than one account available"; then
    print_warning "Account selection needed for D1 database creation."
    
    if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
        print_status "Please select which account to use for resource creation:"
        
        # Extract account IDs and names from the error output
        # Parse the format: `Account Name`: `account_id`
        ACCOUNTS_RAW=$(echo "$D1_OUTPUT" | grep -oE '`[^`]+`: `[^`]+`')
        
        # Create numbered list
        i=1
        declare -a ACCOUNT_IDS
        declare -a ACCOUNT_NAMES
        
        while IFS= read -r line; do
            if [ -n "$line" ]; then
                # Extract name and ID using more precise regex
                name=$(echo "$line" | sed -n 's/^`\([^`]*\)`: `[^`]*`$/\1/p')
                id=$(echo "$line" | sed -n 's/^`[^`]*`: `\([^`]*\)`$/\1/p')
                
                # Skip template placeholders and only add valid entries
                if [ -n "$name" ] && [ -n "$id" ] && [ "$name" != "<name>" ] && [ "$id" != "<account_id>" ]; then
                    echo "$i) $name (ID: $id)"
                    ACCOUNT_NAMES[$i]="$name"
                    ACCOUNT_IDS[$i]="$id"
                    ((i++))
                fi
            fi
        done <<< "$ACCOUNTS_RAW"
        
        echo
        read -p "Enter the number of the account you want to use: " account_choice
        
        if [[ "$account_choice" =~ ^[0-9]+$ ]] && [ "$account_choice" -ge 1 ] && [ "$account_choice" -lt "$i" ]; then
            SELECTED_ACCOUNT_ID="${ACCOUNT_IDS[$account_choice]}"
            SELECTED_ACCOUNT_NAME="${ACCOUNT_NAMES[$account_choice]}"
            
            print_success "Selected account: $SELECTED_ACCOUNT_NAME ($SELECTED_ACCOUNT_ID)"
            export CLOUDFLARE_ACCOUNT_ID="$SELECTED_ACCOUNT_ID"
        else
            print_error "Invalid selection. Please run the script again."
            exit 1
        fi
    fi
    
    # Try creating D1 database again with account ID
    print_status "Retrying D1 database creation with selected account..."
    D1_OUTPUT=$(wrangler d1 create "$PROJECT_NAME-db" 2>&1)
    D1_EXIT_CODE=$?
fi

set -e  # Re-enable exit on error

if [ $D1_EXIT_CODE -ne 0 ]; then
    print_error "Failed to create D1 database."
    echo "Error output: $D1_OUTPUT"
    print_error "Please check your Cloudflare authentication and try again."
    exit 1
fi

DATABASE_ID=$(echo "$D1_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$DATABASE_ID" ]; then
    print_error "Could not extract database ID from output."
    echo "Full output: $D1_OUTPUT"
    print_error "Please check the output above and try again."
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
set +e  # Temporarily disable exit on error

KV_OUTPUT=$(wrangler kv namespace create "KV_RDRX" 2>&1)
KV_EXIT_CODE=$?

if [ $KV_EXIT_CODE -ne 0 ]; then
    print_error "Failed to create KV namespace."
    echo "Error output: $KV_OUTPUT"
    exit 1
fi

KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$KV_ID" ]; then
    print_error "Could not extract KV namespace ID from output."
    echo "Full output: $KV_OUTPUT"
    exit 1
fi

print_status "Creating KV preview namespace..."
KV_PREVIEW_OUTPUT=$(wrangler kv namespace create "KV_RDRX" --preview 2>&1)
KV_PREVIEW_EXIT_CODE=$?

if [ $KV_PREVIEW_EXIT_CODE -ne 0 ]; then
    print_error "Failed to create KV preview namespace."
    echo "Error output: $KV_PREVIEW_OUTPUT"
    exit 1
fi

KV_PREVIEW_ID=$(echo "$KV_PREVIEW_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$KV_PREVIEW_ID" ]; then
    print_error "Could not extract KV preview namespace ID from output."
    echo "Full output: $KV_PREVIEW_OUTPUT"
    exit 1
fi

set -e  # Re-enable exit on error
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

# Configure custom domains and DNS
echo
print_status "🌐 Configuring Custom Domains and DNS"

# Get the worker URL for reference
WORKER_URL="https://$PROJECT_NAME.$(wrangler whoami | grep 'Account ID' | awk '{print $3}').workers.dev"

# Check if the domain is already in Cloudflare
print_status "Checking if $SHORT_DOMAIN is managed by Cloudflare..."
ZONE_CHECK=$(wrangler zone list 2>/dev/null | grep "$SHORT_DOMAIN" || echo "")

if [ -n "$ZONE_CHECK" ]; then
    print_success "Domain $SHORT_DOMAIN found in your Cloudflare account!"
    
    # Extract zone ID
    ZONE_ID=$(echo "$ZONE_CHECK" | awk '{print $1}')
    print_status "Zone ID: $ZONE_ID"
    
    # Configure custom domain for the worker
    print_status "Setting up custom domain for your worker..."
    if wrangler custom-domains add "$SHORT_DOMAIN" >/dev/null 2>&1; then
        print_success "Custom domain $SHORT_DOMAIN configured for your worker!"
    else
        print_warning "Custom domain setup failed. You may need to configure it manually."
    fi
    
    # Configure DNS records for CDN if different from main domain
    if [ "$R2_URL" != "https://$SHORT_DOMAIN" ]; then
        CDN_DOMAIN=$(echo "$R2_URL" | sed 's|https://||' | sed 's|http://||')
        
        if [ "$CDN_DOMAIN" != "$SHORT_DOMAIN" ]; then
            print_status "Setting up DNS for CDN domain: $CDN_DOMAIN"
            
            # Check if CDN domain is a subdomain of the main domain
            if echo "$CDN_DOMAIN" | grep -q "$SHORT_DOMAIN"; then
                print_status "Creating CNAME record for $CDN_DOMAIN..."
                
                # Create CNAME record pointing to R2 bucket
                R2_BUCKET_URL="$PROJECT_NAME-files.r2.cloudflarestorage.com"
                
                # Use wrangler to create DNS record
                if wrangler dns create "$SHORT_DOMAIN" CNAME "$CDN_DOMAIN" "$R2_BUCKET_URL" >/dev/null 2>&1; then
                    print_success "DNS record created: $CDN_DOMAIN -> $R2_BUCKET_URL"
                else
                    print_warning "DNS record creation failed. You may need to create it manually."
                    echo "  Create a CNAME record: $CDN_DOMAIN -> $R2_BUCKET_URL"
                fi
            else
                print_warning "CDN domain $CDN_DOMAIN is not a subdomain of $SHORT_DOMAIN"
                print_status "You'll need to configure DNS for $CDN_DOMAIN manually"
            fi
        fi
    fi
    
    # Configure R2 bucket for public access
    print_status "Configuring R2 bucket for public access..."
    
    # Create R2 bucket custom domain if CDN domain is specified
    if [ "$R2_URL" != "https://$SHORT_DOMAIN" ]; then
        CDN_DOMAIN=$(echo "$R2_URL" | sed 's|https://||' | sed 's|http://||')
        
        # Configure R2 custom domain
        if wrangler r2 bucket domain add "$PROJECT_NAME-files" "$CDN_DOMAIN" >/dev/null 2>&1; then
            print_success "R2 custom domain configured: $CDN_DOMAIN"
        else
            print_warning "R2 custom domain setup failed. You may need to configure it manually."
        fi
    fi
    
else
    print_warning "Domain $SHORT_DOMAIN not found in your Cloudflare account."
    echo
    print_status "To complete the setup, you have two options:"
    echo
    echo "Option 1: Add domain to Cloudflare (Recommended)"
    echo "  1. Go to https://dash.cloudflare.com"
    echo "  2. Click 'Add a Site' and enter: $SHORT_DOMAIN"
    echo "  3. Follow the setup process and update your nameservers"
    echo "  4. Once added, run this command to configure the custom domain:"
    echo "     wrangler custom-domains add $SHORT_DOMAIN"
    echo
    echo "Option 2: Manual DNS Configuration"
    echo "  1. Create a CNAME record in your DNS provider:"
    echo "     Name: @ (or your subdomain)"
    echo "     Value: $WORKER_URL"
    echo "  2. If using a CDN domain, create another CNAME:"
    echo "     Name: $(echo "$R2_URL" | sed 's|https://||' | sed 's|http://||' | sed "s|\.$SHORT_DOMAIN||")"
    echo "     Value: $PROJECT_NAME-files.r2.cloudflarestorage.com"
    echo
fi

# Verify deployment
print_status "🔍 Verifying deployment..."
sleep 5  # Give DNS a moment to propagate

# Test the worker URL
if curl -s --head "$WORKER_URL" | head -n 1 | grep -q "200 OK"; then
    print_success "Worker is responding at: $WORKER_URL"
else
    print_warning "Worker may still be starting up. Check $WORKER_URL in a few minutes."
fi

# Test custom domain if configured
if [ -n "$ZONE_CHECK" ]; then
    if curl -s --head "https://$SHORT_DOMAIN" | head -n 1 | grep -q "200 OK"; then
        print_success "Custom domain is working: https://$SHORT_DOMAIN"
    else
        print_warning "Custom domain may still be propagating. Check https://$SHORT_DOMAIN in a few minutes."
    fi
fi

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
