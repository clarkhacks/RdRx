import { renderPublicNavbar } from '../partials/publicNavbar';

export function renderComingSoonPage(): Response {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coming Soon | RdRx</title>
    <meta name="description" content="This feature is coming soon to RdRx">
    <meta property="og:title" content="Coming Soon | RdRx">
    <meta property="og:description" content="This feature is coming soon to RdRx">
    <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="og:url" content="https://rdrx.co/coming-soon">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <link rel="apple-touch-icon" sizes="57x57" href="https://cdn.rdrx.co/favicons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="https://cdn.rdrx.co/favicons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="https://cdn.rdrx.co/favicons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="https://cdn.rdrx.co/favicons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="https://cdn.rdrx.co/favicons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="https://cdn.rdrx.co/favicons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="https://cdn.rdrx.co/favicons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.rdrx.co/favicons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="https://cdn.rdrx.co/favicons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.rdrx.co/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="https://cdn.rdrx.co/favicons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.rdrx.co/favicons/favicon-16x16.png">
    <link rel="stylesheet" href="/assets/built.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #FFFFFF;
            color: #37352F;
        }
        
        .gradient-text {
            background: linear-gradient(90deg, #FFC107, #E91E63);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero-gradient {
            background: radial-gradient(circle at 30% 30%, rgba(255, 193, 7, 0.15), transparent 30%),
                        radial-gradient(circle at 70% 70%, rgba(233, 30, 99, 0.15), transparent 30%);
        }
    </style>
</head>
<body class="bg-white min-h-screen flex flex-col">
    <!-- Navigation -->
    ${renderPublicNavbar()}

    <!-- Main Content -->
    <main class="flex-grow hero-gradient flex flex-col items-center justify-center p-4 md:p-8">
        <div class="max-w-3xl mx-auto text-center">
            <div class="mb-8">
                <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-24 h-24 mx-auto">
            </div>
            <h1 class="text-4xl sm:text-5xl font-bold mb-6">
                <span class="gradient-text">Coming Soon</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8">
                We're working hard to bring you this feature. Stay tuned!
            </p>
            <div class="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
                <div class="flex items-center justify-center mb-6">
                    <i class="fas fa-tools text-4xl text-gray-400 mr-4"></i>
                    <div class="text-left">
                        <h2 class="text-xl font-semibold">Under Construction</h2>
                        <p class="text-gray-600">This section of our website is currently being developed</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="bg-gray-100 rounded-lg p-4">
                        <h3 class="font-medium mb-2">What to expect</h3>
                        <p class="text-gray-600">We're building new features to make your experience even better. Check back soon!</p>
                    </div>
                    <div class="bg-gray-100 rounded-lg p-4">
                        <h3 class="font-medium mb-2">Want to be notified?</h3>
                        <p class="text-gray-600">Follow us on <a href="https://github.com/clarkhacks/RdRx" class="text-primary-500 hover:underline">GitHub</a> to stay updated on our progress.</p>
                    </div>
                </div>
            </div>
            <div class="mt-8">
                <a href="/" class="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl border border-gray-200">
                    <i class="fas fa-arrow-left mr-2"></i> Back to Home
                </a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row justify-center items-center gap-4">
                <div>© ${new Date().getFullYear()} RdRx. All rights reserved.</div>
                <div class="flex gap-4">
                    <a href="/terms" class="hover:text-primary-500 transition-colors duration-200">Terms of Service</a>
                    <a href="/privacy" class="hover:text-primary-500 transition-colors duration-200">Privacy Policy</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}
