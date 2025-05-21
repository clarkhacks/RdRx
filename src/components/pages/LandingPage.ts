import { renderLandingPageUI, renderLandingPageStyles, renderLandingPageTailwindConfig } from '../ui/LandingPageUI';

function renderLandingPage(): Response {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RdRx - Modern URL Shortener</title>
    <meta name="description" content="RdRx is a modern URL shortener that allows you to create and share short URLs easily.">
    <meta name="keywords" content="URL shortener, short URLs, share links, modern URL shortener">
    <meta name="author" content="RdRx Team">
    <meta name="robots" content="noindex, nofollow">
    <meta property="og:title" content="RdRx - Modern URL Shortener">
    <meta property="og:description" content="RdRx is a modern URL shortener that allows you to create and share short URLs easily.">
    <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="og:url" content="https://rdrx.co">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="RdRx - Modern URL Shortener">
    <meta property="twitter:description" content="RdRx is a modern URL shortener that allows you to create and share short URLs easily.">
    <meta property="twitter:image" content="https://cdn.rdrx.co/banner.jpg">
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
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script>
        ${renderLandingPageTailwindConfig()}
    </script>
    <style>
        ${renderLandingPageStyles()}
    </style>
</head>
<body class="bg-gray-50 text-gray-800">
    ${renderLandingPageUI()}
</body>
</html>
	`;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}

export { renderLandingPage };
