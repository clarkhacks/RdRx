/**
 * Bio View UI Component
 * Renders a user's bio page with links
 */

import { getTheme } from '../../config/bioThemes';

interface BioViewUIProps {
	bioPage: any;
	links: any[];
	shortDomain: string;
	profilePictureUrl?: string | null;
	socialMedia?: Record<string, any>;
}

function renderBioViewUI({ bioPage, links, shortDomain, profilePictureUrl = null, socialMedia = {} }: BioViewUIProps): string {
	// Ensure bioPage has all required properties
	const title = bioPage && bioPage.title ? bioPage.title : 'Bio Page';
	const description = bioPage && bioPage.description ? bioPage.description : 'Check out my bio page';
	const shortcode = bioPage && bioPage.shortcode ? bioPage.shortcode : '';
	const themeName = bioPage && bioPage.theme ? bioPage.theme : 'default';

	// Get theme configuration
	const theme = getTheme(themeName);

	// Ensure links is an array
	const safeLinks = Array.isArray(links) ? links : [];

	return `
    <div class="container">
        <div class="profile">
            <div class="avatar">
                <img src="${profilePictureUrl || 'https://via.placeholder.com/80'}" alt="${title}" 
                     onerror="this.src='https://via.placeholder.com/80?text=👤'">
            </div>
            <h1 class="username">${title}</h1>
            ${description ? `<p class="bio">${description}</p>` : ''}
        </div>

        <div class="links">
            ${safeLinks
							.map(
								(link) => `
                <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="link-card">
                    <div class="link-icon">
                        ${link.icon || '🔗'}
                    </div>
                    <div class="link-content">
                        <h3 class="link-title">${link.title || 'Link'}</h3>
                        ${link.description ? `<p class="link-description">${link.description}</p>` : ''}
                    </div>
                </a>
            `,
							)
							.join('')}
        </div>

        ${
					Object.keys(socialMedia).some((platform) => {
						const data = socialMedia[platform];
						return data && ((typeof data === 'object' && data.url) || (typeof data === 'string' && data));
					})
						? `
        <div class="social-icons">
            ${Object.entries(socialMedia)
							.map(([platform, data]) => {
								if (!data) return '';

								const url = typeof data === 'object' ? data.url : data;
								const icon = typeof data === 'object' ? data.icon : '';

								if (!url) return '';

								return `
                <a href="${url}" target="_blank" rel="noopener noreferrer" title="${platform}">
                    ${
											icon
												? `
                        <img src="https://icons.rdrx.co/png/${icon}" alt="${platform}" class="social-icon-img" style="width: 24px; height: 24px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    `
												: `
                        <div class="social-icon-fallback" style="width: 24px; height: 24px; background: #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                            ${platform.charAt(0).toUpperCase()}
                        </div>
                    `
										}
                </a>
                `;
							})
							.join('')}
        </div>
        `
						: ''
				}

        <div class="footer">
            Powered by <a href="https://${shortDomain}" style="color: #666; text-decoration: underline;">RdRx</a>
        </div>
    </div>
    `;
}

function renderBioViewStyles(themeName: string = 'default'): string {
	const theme = getTheme(themeName);

	return `
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: ${theme.background};
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            margin: 0;
        }
        .container {
            background: ${theme.containerBg};
            border-radius: 16px;
            box-shadow: ${theme.containerShadow};
            width: 100%;
            max-width: 600px;
            padding: 40px;
        }
        .profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .username {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: ${theme.textPrimary};
        }
        .bio {
            color: ${theme.textSecondary};
            text-align: center;
            margin-bottom: 15px;
        }
        .links {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .link-card {
            background: ${theme.linkCardBg};
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: ${theme.textPrimary};
            transition: all 0.2s ease;
        }
        .link-card:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.linkCardHover};
        }
        .link-icon {
            width: 48px;
            height: 48px;
            background: ${theme.linkIconBg};
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 16px;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .link-content {
            flex-grow: 1;
            overflow: hidden;
        }
        .link-title {
            font-weight: 600;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: ${theme.textPrimary};
        }
        .link-description {
            color: ${theme.textSecondary};
            font-size: 0.875rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }
        .social-icon {
            width: 24px;
            height: 24px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .social-icon:hover {
            opacity: 1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.75rem;
            color: ${theme.textSecondary};
        }
        .footer a {
            color: ${theme.accentColor};
            text-decoration: underline;
        }
    </style>
    `;
}

export { renderBioViewUI, renderBioViewStyles };
