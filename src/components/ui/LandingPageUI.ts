function renderLandingPageUI(): string {
	return `
    <!-- Hero Section -->
    <header class="hero-gradient min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-5xl mx-auto text-center">
            <div class="mb-8">
                <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-24 h-24 mx-auto">
            </div>
            <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                <span class="gradient-text">RdRx</span>
            </h1>
            <p class="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8">Modern URL Shortening & Content Sharing</p>
            <p class="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12">
                Simplify your links, share code snippets, and host files with our powerful, cloud-native platform
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="#features" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl">
                    Explore Features
                </a>
                <a href="https://github.com/clarkhacks/RdRx" target="_blank" class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl border border-gray-200">
                    <i class="fab fa-github mr-2"></i> GitHub
                </a>
            </div>
        </div>
    </header>

    <!-- About Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-5xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">What is <span class="gradient-text">RdRx</span>?</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    RdRx (Redirects) is an open-source URL shortener and content sharing platform built with modern cloud technologies.
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="bg-gray-50 p-8 rounded-xl shadow-md">
                    <h3 class="text-2xl font-semibold mb-4">Powered by Cloudflare</h3>
                    <p class="text-gray-600 mb-6">
                        RdRx runs on Cloudflare Workers, a serverless platform that delivers lightning-fast performance at the edge. Your links and content are delivered from data centers close to your users, ensuring minimal latency.
                    </p>
                    <div class="flex items-center">
                        <i class="fas fa-server text-primary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">Serverless architecture</span>
                    </div>
                    <div class="flex items-center mt-3">
                        <i class="fas fa-globe text-primary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">Global edge network</span>
                    </div>
                    <div class="flex items-center mt-3">
                        <i class="fas fa-bolt text-primary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">Ultra-low latency</span>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-8 rounded-xl shadow-md">
                    <h3 class="text-2xl font-semibold mb-4">Data Storage with D1</h3>
                    <p class="text-gray-600 mb-6">
                        All your links and analytics are stored in Cloudflare D1, a serverless SQL database built on SQLite. This provides reliable, scalable storage with minimal overhead and maximum performance.
                    </p>
                    <div class="flex items-center">
                        <i class="fas fa-database text-secondary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">Serverless SQL database</span>
                    </div>
                    <div class="flex items-center mt-3">
                        <i class="fas fa-shield-alt text-secondary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">Secure data storage</span>
                    </div>
                    <div class="flex items-center mt-3">
                        <i class="fas fa-tachometer-alt text-secondary-500 text-xl mr-3"></i>
                        <span class="text-gray-700">High-performance queries</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-16 text-center">
                <p class="text-gray-600 mb-4">
                    RdRx is open source but the code is currently private while we clean it up for public release.
                </p>
                <p class="text-gray-600">
                    We're committed to transparency and community collaboration, and we'll be making the codebase public soon.
                </p>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div class="max-w-5xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">Features</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    RdRx offers a comprehensive set of features for link management and content sharing.
                </p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Current Features -->
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-link text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">URL Shortening</h3>
                    <p class="text-gray-600">
                        Create concise, memorable links from long URLs with custom shortcodes.
                    </p>
                </div>
                
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-code text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Code Snippets</h3>
                    <p class="text-gray-600">
                        Share code snippets with syntax highlighting and easy access.
                    </p>
                </div>
                
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-file-alt text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">File Hosting</h3>
                    <p class="text-gray-600">
                        Upload and share files through short links with global CDN delivery.
                    </p>
                </div>
                
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-chart-line text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analytics</h3>
                    <p class="text-gray-600">
                        Track link performance with detailed analytics and insights.
                    </p>
                </div>
                
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-user-shield text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Authentication</h3>
                    <p class="text-gray-600">
                        Secure server-side authentication with JWT tokens and HTTP-only cookies.
                    </p>
                </div>
                
                <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-clock text-primary-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Auto Cleanup</h3>
                    <p class="text-gray-600">
                        Schedule automatic deletion of expired links and files.
                    </p>
                </div>
            </div>
            
            <!-- Coming Soon Features -->
            <div class="mt-16">
                <h3 class="text-2xl font-semibold mb-6 text-center">Coming Soon</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-envelope text-primary-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Email Integration</h3>
                        <p class="text-gray-600">
                            Password reset and notifications via Mailgun integration.
                        </p>
                    </div>
                    
                    <div class="feature-card bg-white p-6 rounded-xl shadow-md">
                        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-user-cog text-primary-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Account Management</h3>
                        <p class="text-gray-600">
                            Complete user profile management with profile pictures and password changes.
                        </p>
                    </div>
                    
                    <div class="feature-card bg-gray-100 p-6 rounded-xl shadow-sm border border-dashed border-gray-300">
                        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-mobile-alt text-gray-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Mobile App</h3>
                        <p class="text-gray-600">
                            Native mobile applications for iOS and Android coming soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-8 md:mb-0">
                    <div class="flex items-center">
                        <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-10 h-10 mr-3">
                        <span class="text-2xl font-bold gradient-text">RdRx</span>
                    </div>
                    <p class="text-gray-400 mt-2">Modern URL shortening & content sharing</p>
                </div>
                
                <div>
                    <p class="text-gray-400 mb-2">
                        Released under the <a href="https://github.com/clarkhacks/RdRx/blob/main/LICENSE" class="text-primary-400 hover:text-primary-300 transition">MIT License</a>
                    </p>
                    <p class="text-gray-500 text-sm">
                        &copy; 2025 RdRx. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </footer>
    `;
}

function renderLandingPageStyles(): string {
	return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
        font-family: 'Inter', sans-serif;
    }
    
    .gradient-text {
        background: linear-gradient(90deg, #0ea5e9, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .hero-gradient {
        background: radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.15), transparent 30%),
                    radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.15), transparent 30%);
    }
    
    .feature-card {
        transition: all 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    `;
}

function renderLandingPageTailwindConfig(): string {
	return `
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    primary: {
                        50: '#f0f9ff',
                        100: '#e0f2fe',
                        200: '#bae6fd',
                        300: '#7dd3fc',
                        400: '#38bdf8',
                        500: '#0ea5e9',
                        600: '#0284c7',
                        700: '#0369a1',
                        800: '#075985',
                        900: '#0c4a6e',
                    },
                    secondary: {
                        50: '#fdf2f8',
                        100: '#fce7f3',
                        200: '#fbcfe8',
                        300: '#f9a8d4',
                        400: '#f472b6',
                        500: '#ec4899',
                        600: '#db2777',
                        700: '#be185d',
                        800: '#9d174d',
                        900: '#831843',
                    },
                },
                fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                },
            },
        },
    }
    `;
}

export { renderLandingPageUI, renderLandingPageStyles, renderLandingPageTailwindConfig };
