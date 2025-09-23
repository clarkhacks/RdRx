interface DocumentHeadProps {
	title: string;
	additionalScripts?: string;
  noMeta?: boolean;
  customMeta?: {
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    keywords?: string;
  };
}

function renderDocumentHead({ title, additionalScripts = '', noMeta = false, customMeta }: DocumentHeadProps): string {
  // Use custom meta or defaults
  const metaDescription = customMeta?.description || "RdRx is a modern URL shortener that allows you to create and share short URLs easily.";
  const ogTitle = customMeta?.ogTitle || `${title} | RdRx`;
  const ogDescription = customMeta?.ogDescription || metaDescription;
  const ogImage = customMeta?.ogImage || "/assets/banner.jpg";
  const ogUrl = customMeta?.ogUrl || "https://rdrx.co";
  const keywords = customMeta?.keywords || "";

	return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${title}</title>
  <meta name="description" content="${metaDescription}">
  ${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
  `+ (noMeta ? '' : `
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RdRx">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="${ogTitle}">
  <meta property="twitter:description" content="${ogDescription}">
  <meta property="twitter:image" content="${ogImage}">
  `) + `
  <link rel="apple-touch-icon" sizes="57x57" href="/assets/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/assets/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/assets/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/assets/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/assets/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/assets/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/assets/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/assets/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="/assets/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/built.css">
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
