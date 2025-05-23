interface DocumentHeadProps {
	title: string;
	additionalScripts?: string;
}

function renderDocumentHead({ title, additionalScripts = '' }: DocumentHeadProps): string {
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#FFF8E1',
              100: '#FFECB3',
              200: '#FFE082',
              300: '#FFD54F',
              400: '#FFCA28',
              500: '#FFC107', /* Sunset Yellow */
              600: '#FFB300',
              700: '#FFA000',
              800: '#FF8F00',
              900: '#FF6F00',
            },
            secondary: {
              50: '#FCE4EC',
              100: '#F8BBD0',
              200: '#F48FB1',
              300: '#F06292',
              400: '#EC407A',
              500: '#E91E63', /* Hot Pink */
              600: '#D81B60',
              700: '#C2185B',
              800: '#AD1457',
              900: '#880E4F',
            },
            accent: {
              50: '#F3E5F5',
              100: '#E1BEE7',
              200: '#CE93D8',
              300: '#BA68C8',
              400: '#AB47BC',
              500: '#E16ED8', /* Magenta Mist */
              600: '#8E24AA',
              700: '#7B1FA2',
              800: '#6A1B9A',
              900: '#4A148C',
            },
            gray: {
              50: '#FAFAFA',
              100: '#F5F5F5',
              200: '#EEEEEE',
              300: '#E0E0E0',
              400: '#BDBDBD',
              500: '#9E9E9E',
              600: '#757575',
              700: '#616161',
              800: '#424242', /* Charcoal Gray */
              900: '#212121', /* Deep Black */
            },
            surface: {
              light: '#FFFDF9', /* Background (light) */
              dark: '#121212',  /* Background (dark) */
            },
          },
          fontFamily: {
            sans: ['Poppins', 'Inter', 'sans-serif'],
          },
          borderRadius: {
            'xl': '1rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
          },
          animation: {
            'bounce-slow': 'bounce 3s infinite',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Poppins', 'Inter', sans-serif;
      background-color: #FFFDF9;
    }
    
    .gradient-text {
      background: linear-gradient(90deg, #FFC107, #E91E63);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .playful-shadow {
      box-shadow: 5px 5px 0px #E91E63;
    }
    
    .btn-playful {
      transition: all 0.2s ease;
      transform-origin: center;
    }
    
    .btn-playful:hover {
      transform: scale(1.05) rotate(1deg);
    }
    
    .btn-playful:active {
      transform: scale(0.98);
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  ${additionalScripts}
</head>
  `;
}

export { renderDocumentHead };
