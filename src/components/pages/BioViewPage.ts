import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderBioViewUI, renderBioViewStyles } from '../ui/BioViewUI';

interface BioViewPageProps {
	bioPage: any;
	links: any[];
	shortDomain: string;
	profilePictureUrl?: string | null;
}

/**
 * Render a bio view page
 */
function renderBioViewPage({ bioPage, links, shortDomain, profilePictureUrl = null }: BioViewPageProps): string {
	// Ensure bioPage has all required properties
	const title = bioPage && bioPage.title ? bioPage.title : 'Bio Page';
	const description = bioPage && bioPage.description ? bioPage.description : 'Check out my bio page';
	const shortcode = bioPage && bioPage.shortcode ? bioPage.shortcode : '';

	// Generate meta tags for SEO and social sharing
	const metaTags = `
    <meta property="og:title" content="${title} | Bio Page">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${profilePictureUrl || 'https://cdn.rdrx.co/banner.jpg'}">
    <meta property="og:url" content="https://${shortDomain}/${shortcode}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  `;

	return `
<!DOCTYPE html>
<html lang="en">
${renderDocumentHead({ title, additionalScripts: metaTags })}
<body>
  ${renderBioViewStyles()}
  ${renderBioViewUI({ bioPage, links, shortDomain, profilePictureUrl })}
</body>
</html>
  `;
}

export { renderBioViewPage };
