interface DocumentHeadProps {
	title: string;
	clerkPublishableKey?: string;
	additionalScripts?: string;
}

function renderDocumentHead({ title, clerkPublishableKey, additionalScripts = '' }: DocumentHeadProps): string {
	return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${title} | RdRx</title>
  <meta property="og:title" content="${title} | RdRx">
  <meta property="og:description" content="RdRx is a modern URL shortener that allows you to create and share short URLs easily.">
  <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
  <meta property="og:url" content="https://rdrx.co">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RdRx">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="${title} | RdRx">
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
  <script
    crossorigin="anonymous"
    data-clerk-publishable-key="${clerkPublishableKey}"
    src="https://grateful-koi-58.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
    type="text/javascript">
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
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
              950: '#082f49',
            },
          }
        }
      }
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  ${additionalScripts}
</head>
  `;
}

export { renderDocumentHead };
