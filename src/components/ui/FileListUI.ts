function renderFileListUI(fileUrls: string[], shortcode: string): string {
	// Function to determine if a file can be viewed in a browser
	const canViewInBrowser = (fileType: string): boolean => {
		const viewableTypes = [
			// Images
			'jpg',
			'jpeg',
			'png',
			'gif',
			'svg',
			'webp',
			// Documents
			'pdf',
			// Videos
			'mp4',
			'webm',
			// Audio
			'mp3',
			'wav',
			'ogg',
			// Text
			'txt',
			'html',
			'css',
			'js',
			'json',
			'xml',
		];
		return viewableTypes.includes(fileType.toLowerCase());
	};

	const fileRows = fileUrls
		.map((url) => {
			const fileName = url.split('/').pop() || 'unknown';
			const fileType = fileName.split('.').pop()?.toLowerCase() || 'unknown';
			let iconUrl = 'https://cdn.rdrx.co/icons/generic_file.png';

			if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType)) {
				iconUrl = url;
			} else if (fileType === 'pdf') {
				iconUrl = 'https://cdn.rdrx.co/icons/pdf.png';
			} else if (['mp4', 'webm', 'avi', 'mov'].includes(fileType)) {
				iconUrl = 'https://cdn.rdrx.co/icons/video.png';
			} else if (['mp3', 'wav', 'ogg'].includes(fileType)) {
				iconUrl = 'https://cdn.rdrx.co/icons/audio.png';
			} else if (['txt', 'html', 'css', 'js', 'json', 'xml'].includes(fileType)) {
				iconUrl = 'https://cdn.rdrx.co/icons/text.png';
			}

			// Determine if this file can be viewed in the browser
			const isViewable = canViewInBrowser(fileType);

			return `
                <div class="table-row">
                    <div class="table-cell">
                        <div class="flex items-center gap-4">
                            <a href="${url}" class="flex items-center w-12 h-12 overflow-hidden">
                                <img class="w-full h-auto rounded-github-md" src="${iconUrl}" alt="${fileName}" />
                            </a>
                            <span class="text-gray-800 truncate hidden sm:inline">
                                ${fileName.length >= 20 ? `${fileName.slice(0, 15)}...${fileName.slice(-3)}` : fileName}
                            </span>
                        </div>
                    </div>
                    <div class="table-cell text-right text-gray-500 hidden sm:table-cell">${fileType}</div>
                    <div class="table-cell text-right">
                        <div class="flex justify-end gap-2">
                            ${
															isViewable
																? `
                                <a href="${url}" target="_blank" class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-github hover:from-blue-600 hover:to-blue-700 transition duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                </a>
                            `
																: ''
														}
                            <a href="${url}" download class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-github hover:from-pink-600 hover:to-pink-700 transition duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
		})
		.join('');

	// Add custom CSS for gradient styling
	const styles = `
        <style>
            .gradient-text {
                background: linear-gradient(90deg, #FFC107, #FF8A00);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .form-card {
                transition: all 0.3s ease;
                border-radius: 24px;
                border: 2px solid #FFF;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            }
            .table-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .table-row {
                display: flex;
                flex-direction: column;
                background: #fff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            }
            .table-cell {
                margin-bottom: 0.5rem;
            }
            .table-cell:last-child {
                margin-bottom: 0;
            }
        </style>
    `;

	return `
        ${styles}
        <section class="bg-white shadow-md rounded-github p-6 md:p-8 mb-8 max-w-6xl mx-auto form-card">
            <h2 class="text-3xl font-bold mb-6 gradient-text">File List: ${shortcode}</h2>
            <p class="mb-6 text-gray-600">Contains ${fileUrls.length} file${fileUrls.length !== 1 ? 's' : ''}</p>
            <div class="table-container">
                ${fileRows}
            </div>
        </section>
    `;
}

export { renderFileListUI };
