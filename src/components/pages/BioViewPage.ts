import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderBioViewUI, renderBioViewStyles } from '../ui/BioViewUI';

interface BioViewPageProps {
	bioPage: any;
	links: any[];
	shortDomain: string;
	profilePictureUrl?: string | null;
	socialMedia?: Record<string, string>;
}

/**
 * Render a bio view page
 */
function renderBioViewPage({ bioPage, links, shortDomain, profilePictureUrl = null, socialMedia = {} }: BioViewPageProps): string {
	// Ensure bioPage has all required properties
	const title = bioPage && bioPage.title ? bioPage.title : 'Bio Page';
	const description = bioPage && bioPage.description ? bioPage.description : 'Check out my bio page';
	const shortcode = bioPage && bioPage.shortcode ? bioPage.shortcode : '';

	// Use meta fields from the database if available, otherwise fall back to defaults
	const metaTitle = bioPage?.meta_title || title;
	const metaDescription = bioPage?.meta_description || description;
	const metaTags = bioPage?.meta_tags || '';
	const ogImage = bioPage?.og_image_url || profilePictureUrl || 'https://cdn.rdrx.co/banner.jpg';
	const pageUrl = `https://${shortDomain}/${shortcode}`;

	// Prepare custom meta data for DocumentHead
	const customMeta = {
		description: metaDescription,
		ogTitle: metaTitle,
		ogDescription: metaDescription,
		ogImage: ogImage,
		ogUrl: pageUrl,
		keywords: metaTags
	};

	return `
<!DOCTYPE html>
<html lang="en">
${renderDocumentHead({ 
	title: metaTitle, 
	customMeta: customMeta,
	noMeta: false 
})}
<body>
  ${renderBioViewStyles()}
  ${renderBioViewUI({ bioPage, links, shortDomain, profilePictureUrl, socialMedia })}
</body>
</html>
  `;
}

export { renderBioViewPage };
