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
              50: '#F0F4F9',
              100: '#E6EDF5',
              200: '#D1E0ED',
              300: '#A3C1DB',
              400: '#7BA2C9',
              500: '#5383B7', /* Notion Blue */
              600: '#4A75A4',
              700: '#3D6087',
              800: '#2F4A69',
              900: '#1F3246',
            },
            secondary: {
              50: '#F5F5F5',
              100: '#EBEBEB',
              200: '#E0E0E0',
              300: '#CCCCCC',
              400: '#B8B8B8',
              500: '#A3A3A3', /* Notion Gray */
              600: '#8F8F8F',
              700: '#666666',
              800: '#474747',
              900: '#333333',
            },
            accent: {
              50: '#F9F5FF',
              100: '#F4EBFF',
              200: '#E9D7FE',
              300: '#D6BBFB',
              400: '#B692F6',
              500: '#9E77ED', /* Notion Purple */
              600: '#7F56D9',
              700: '#6941C6',
              800: '#53389E',
              900: '#42307D',
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
              800: '#424242',
              900: '#212121',
            },
            surface: {
              light: '#FFFFFF', /* Notion Background (light) */
              dark: '#191919',  /* Notion Background (dark) */
            },
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          borderRadius: {
            'xl': '0.375rem',
            '2xl': '0.5rem',
            '3xl': '0.75rem',
          },
          animation: {
            'bounce-slow': 'bounce 3s infinite',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          boxShadow: {
            'notion': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
            'notion-hover': '0 3px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            'notion-card': 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px',
            'notion-card-hover': 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.05) 0px 9px 24px',
          },
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background-color: #FFFFFF;
      color: #37352F;
    }
    
    /* Notion-style gradient text */
    .gradient-text {
      background: linear-gradient(90deg, #5383B7, #9E77ED);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Notion-style card */
    .notion-card {
      border-radius: 0.375rem;
      box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    
    .notion-card:hover {
      box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.05) 0px 9px 24px;
    }
    
    /* Notion-style buttons */
    .notion-btn {
      font-weight: 500;
      border-radius: 0.375rem;
      transition: background-color 0.2s ease;
      padding: 0.5rem 0.75rem;
    }
    
    .notion-btn-primary {
      background-color: #5383B7;
      color: white;
    }
    
    .notion-btn-primary:hover {
      background-color: #4A75A4;
    }
    
    .notion-btn-secondary {
      background-color: #F5F5F5;
      color: #37352F;
    }
    
    .notion-btn-secondary:hover {
      background-color: #EBEBEB;
    }
    
    /* Notion-style table */
    .notion-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    
    .notion-table th {
      font-weight: 500;
      text-align: left;
      padding: 0.75rem;
      border-bottom: 1px solid #EEEEEE;
      color: #6B6B6B;
    }
    
    .notion-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #EEEEEE;
    }
    
    .notion-table tr:hover {
      background-color: #F7F7F7;
    }
    
    /* Responsive table for mobile */
    @media (max-width: 640px) {
      .notion-table-responsive {
        display: block;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Card-based layout for very small screens */
      .notion-table-cards td {
        display: block;
        text-align: right;
        padding-left: 50%;
        position: relative;
      }
      
      .notion-table-cards td:before {
        content: attr(data-label);
        position: absolute;
        left: 0.75rem;
        width: 45%;
        text-align: left;
        font-weight: 500;
      }
    }
    
    /* Replace playful shadow with notion-style shadow */
    .playful-shadow {
      box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
    }
    
    /* Replace playful button with notion-style button */
    .btn-playful {
      transition: background-color 0.2s ease;
    }
    
    .btn-playful:hover {
      transform: none;
      background-color: #F7F7F7;
    }
    
    .btn-playful:active {
      transform: none;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  ${additionalScripts}
</head>
  `;
}

export { renderDocumentHead };
