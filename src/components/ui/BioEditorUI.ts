interface BioEditorUIProps {
	shortcode?: string;
	shortcodeValue?: string;
	shortDomain?: string;
}

function renderBioEditorUI(props: BioEditorUIProps = {}): string {
	const { shortcode, shortcodeValue, shortDomain } = props;

	return `
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
  
  .input-focus:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
  }
  
  .btn-gradient {
    background: #000;
    color: white;
    border-radius: 50px;
    transition: all 0.2s ease;
  }
  
  .btn-gradient:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  .success-gradient {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    border: none;
    border-left: 4px solid #10b981;
  }
  
  .link-item {
    background: #fff;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    cursor: move;
  }
  
  .link-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
  
  .link-item.dragging {
    opacity: 0.5;
  }
  
  .preview-panel {
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }
  
  .preview-phone {
    width: 100%;
    max-width: 375px;
    margin: 0 auto;
    background: #fff;
    border-radius: 40px;
    padding: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 12px solid #1f2937;
  }
  
  .preview-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px;
    padding: 32px 24px;
    min-height: 600px;
  }
  
  .preview-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 4px solid white;
    margin: 0 auto 16px;
    object-fit: cover;
  }
  
  .preview-link {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .preview-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .preview-link-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .preview-social {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }
  
  .preview-social-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .preview-social-icon:hover {
    transform: scale(1.1);
    background: white;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    transition: .3s;
    border-radius: 24px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: #10b981;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(24px);
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .add-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .add-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .collapsible-section {
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .collapsible-header {
    display: flex;
    align-items: center;
    justify-content: between;
    cursor: pointer;
    user-select: none;
  }
  
  .collapsible-content {
    margin-top: 20px;
    display: none;
  }
  
  .collapsible-content.open {
    display: block;
  }
</style>

<div class="max-w-7xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2 gradient-text">My Bio Page</h1>
      <p class="text-gray-500">Create your personal link-in-bio page</p>
    </div>

    <!-- Success Alert -->
    <div class="success-gradient rounded-lg p-4 mb-6 hidden" id="success-alert">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span id="success-message" class="text-green-700 font-medium"></span>
        </div>
        <button id="copy-button" class="ml-4 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-md transition-colors duration-200 flex items-center gap-1" style="display: none;">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
          </svg>
          Copy
        </button>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div id="loading-indicator" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Loading your bio page...</p>
    </div>
    
    <!-- Main Content Grid -->
    <div id="main-content" class="grid grid-cols-1 lg:grid-cols-2 gap-8" style="display: none;">
        <!-- Editor Panel -->
        <div class="space-y-6">
            <form id="bioForm" class="space-y-6">
                <!-- Basic Info Section -->
                <div class="bg-white form-card p-6">
                    <h2 class="text-xl font-bold mb-4 text-gray-800">Basic Info</h2>
                    
                    <!-- Bio URL -->
                    <div class="mb-4">
                        <label for="customCode" class="block text-sm font-medium text-gray-700 mb-1">Bio Page URL</label>
                        <div class="flex items-start">
                            <div class="relative flex-grow">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 font-medium">
                                ${shortDomain}/
                              </div>
                              <input type="text" id="customCode" name="customCode"
                                placeholder="your-username"
                                class="pl-[72px] block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                            </div>
                            <button type="button" class="ml-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
                              onclick="document.querySelector('#customCode').value = Math.random().toString(36).substr(2, 8);">
                              Random
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Choose a unique URL for your bio page</p>
                    </div>

                    <!-- Title & Description -->
                    <div class="space-y-4">
                        <div>
                            <label for="bioTitle" class="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                            <input type="text" id="bioTitle" name="bioTitle" placeholder="Your Name or Brand"
                                class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        </div>
                        <div>
                            <label for="bioDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="bioDescription" name="bioDescription" rows="2" placeholder="What you do or your tagline"
                                class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition resize-none"></textarea>
                        </div>
                    </div>
                    
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p class="text-sm text-blue-800">
                            <strong>Profile Picture:</strong> Update your profile picture in <a href="/account" class="underline font-semibold">Account Settings</a>
                        </p>
                    </div>
                </div>

                <!-- Links Section -->
                <div class="bg-white form-card p-6">
                    <div class="section-header">
                        <h2 class="text-xl font-bold text-gray-800">Links</h2>
                        <button type="button" id="addLinkBtn" class="add-button">
                            + Add Link
                        </button>
                    </div>
                    <div id="bioLinkContainer" class="space-y-3">
                        <!-- Links will be added here -->
                    </div>
                </div>

                <!-- Social Media Section -->
                <div class="bg-white form-card p-6">
                    <div class="section-header">
                        <h2 class="text-xl font-bold text-gray-800">Social Media</h2>
                        <button type="button" id="addSocialBtn" class="add-button">
                            + Add Social
                        </button>
                    </div>
                    <div id="socialLinksContainer" class="space-y-3">
                        <!-- Social links will be added here -->
                    </div>
                </div>

                <!-- SEO Settings (Collapsible) -->
                <div class="collapsible-section">
                    <div class="collapsible-header" onclick="toggleSection('seo')">
                        <h2 class="text-xl font-bold text-gray-800 flex-grow">SEO Settings</h2>
                        <svg id="seo-chevron" class="w-6 h-6 text-gray-600 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div id="seo-content" class="collapsible-content">
                        <div class="space-y-4">
                            <div>
                                <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                <input type="text" id="metaTitle" name="metaTitle" placeholder="SEO title for search engines"
                                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                                <p class="text-xs text-gray-500 mt-1">50-60 characters recommended</p>
                            </div>
                            
                            <div>
                                <label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea id="metaDescription" name="metaDescription" rows="3" placeholder="Brief description for search engines"
                                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition resize-none"></textarea>
                                <p class="text-xs text-gray-500 mt-1">150-160 characters recommended</p>
                            </div>
                            
                            <div>
                                <label for="metaTags" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input type="text" id="metaTags" name="metaTags" placeholder="e.g., entrepreneur, designer, developer"
                                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                                <p class="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                            </div>
                            
                            <div>
                                <label for="ogImage" class="block text-sm font-medium text-gray-700 mb-1">Open Graph Image</label>
                                <input type="file" id="ogImage" name="ogImage" accept="image/*"
                                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                                <p class="text-xs text-gray-500 mt-1">1200x630px recommended</p>
                                <img id="ogImagePreview" class="mt-3 max-w-full h-auto rounded-lg" style="display: none;" alt="OG Image Preview">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                        class="w-full btn-gradient text-white font-medium py-4 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300 text-lg">
                    <span id="submit-text">Save Bio Page</span>
                </button>
            </form>
        </div>

        <!-- Live Preview Panel -->
        <div class="preview-panel">
            <div class="bg-gray-100 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">Live Preview</h3>
                <div class="preview-phone">
                    <div class="preview-content" id="preview-content">
                        <img id="preview-avatar" class="preview-avatar" src="https://via.placeholder.com/96" alt="Profile">
                        <h2 id="preview-title" class="text-2xl font-bold text-white text-center mb-2">Your Name</h2>
                        <p id="preview-description" class="text-white text-center opacity-90 mb-6">Your description</p>
                        <div id="preview-links">
                            <!-- Preview links will appear here -->
                        </div>
                        <div id="preview-social" class="preview-social">
                            <!-- Preview social icons will appear here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Link Template -->
<template id="linkTemplate">
    <div class="link-item" draggable="true" data-link-index="">
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0 cursor-grab">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
            </div>
            <div class="flex-grow space-y-2">
                <input type="text" placeholder="Link Title" class="link-title w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <input type="url" placeholder="https://example.com" class="link-url w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div class="flex items-center gap-2">
                <label class="toggle-switch">
                    <input type="checkbox" class="link-enabled" checked>
                    <span class="toggle-slider"></span>
                </label>
                <button type="button" class="text-red-400 hover:text-red-600 remove-link" title="Remove">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<!-- Social Link Template -->
<template id="socialLinkTemplate">
    <div class="link-item">
        <div class="flex items-center gap-4">
            <div class="flex-grow grid grid-cols-2 gap-3">
                <input type="text" placeholder="Platform (e.g., Twitter)" class="social-platform px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <input type="url" placeholder="https://..." class="social-url px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="button" class="text-red-400 hover:text-red-600 remove-social" title="Remove">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    </div>
</template>
    `;
}

function renderBioEditorScripts(shortDomain: string): string {
	return `
    // Load clipboard.js
    const clipboardScript = document.createElement('script');
    clipboardScript.src = '/assets/clipboard.min.js';
    document.head.appendChild(clipboardScript);

    let isEditing = false;
    let currentOgImageFile = null;
    let draggedElement = null;

    // Toggle collapsible sections
    function toggleSection(sectionId) {
        const content = document.getElementById(sectionId + '-content');
        const chevron = document.getElementById(sectionId + '-chevron');
        content.classList.toggle('open');
        chevron.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Load existing bio data
    async function loadBioData() {
        try {
            const response = await fetch('/api/bio/my-bio');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.bioPage) {
                    isEditing = true;
                    populateForm(data.bioPage, data.links || [], data.socialMedia || {});
                    document.getElementById('submit-text').textContent = 'Update Bio Page';
                }
            }
        } catch (error) {
            console.error('Error loading bio data:', error);
        } finally {
            document.getElementById('loading-indicator').style.display = 'none';
            document.getElementById('main-content').style.display = 'grid';
            
            // Add initial link if no existing data
            if (!isEditing) {
                addBioLink();
            }
        }
    }

    function populateForm(bioPage, links, socialMedia = {}) {
        document.getElementById('customCode').value = bioPage.shortcode || '';
        document.getElementById('bioTitle').value = bioPage.title || '';
        document.getElementById('bioDescription').value = bioPage.description || '';
        
        // Update preview
        updatePreview();
        
        // Populate meta fields
        if (bioPage.meta_title) document.getElementById('metaTitle').value = bioPage.meta_title;
        if (bioPage.meta_description) document.getElementById('metaDescription').value = bioPage.meta_description;
        if (bioPage.meta_tags) document.getElementById('metaTags').value = bioPage.meta_tags;
        if (bioPage.og_image_url) {
            const preview = document.getElementById('ogImagePreview');
            preview.src = bioPage.og_image_url;
            preview.style.display = 'block';
        }
        
        // Populate social media links
        Object.entries(socialMedia).forEach(([platform, data]) => {
            if (data && typeof data === 'object' && data.url) {
                addSocialLink(platform, data.url);
            }
        });
        
        // Populate bio links
        if (links && links.length > 0) {
            links.forEach(link => addBioLink(link));
        } else {
            addBioLink();
        }
    }

    // Add bio link
    function addBioLink(linkData = null) {
        const template = document.getElementById('linkTemplate');
        const clone = template.content.cloneNode(true);
        const linkItem = clone.querySelector('.link-item');
        
        if (linkData) {
            linkItem.querySelector('.link-title').value = linkData.title || '';
            linkItem.querySelector('.link-url').value = linkData.url || '';
            linkItem.querySelector('.link-enabled').checked = linkData.enabled !== false;
        }
        
        // Add event listeners
        linkItem.querySelector('.link-title').addEventListener('input', updatePreview);
        linkItem.querySelector('.link-url').addEventListener('input', updatePreview);
        linkItem.querySelector('.link-enabled').addEventListener('change', updatePreview);
        linkItem.querySelector('.remove-link').addEventListener('click', function() {
            linkItem.remove();
            updatePreview();
        });
        
        // Drag and drop
        linkItem.addEventListener('dragstart', handleDragStart);
        linkItem.addEventListener('dragover', handleDragOver);
        linkItem.addEventListener('drop', handleDrop);
        linkItem.addEventListener('dragend', handleDragEnd);
        
        document.getElementById('bioLinkContainer').appendChild(clone);
        updatePreview();
    }

    // Add social link
    function addSocialLink(platform = '', url = '') {
        const template = document.getElementById('socialLinkTemplate');
        const clone = template.content.cloneNode(true);
        const socialItem = clone.querySelector('.link-item');
        
        if (platform) socialItem.querySelector('.social-platform').value = platform;
        if (url) socialItem.querySelector('.social-url').value = url;
        
        socialItem.querySelector('.social-platform').addEventListener('input', updatePreview);
        socialItem.querySelector('.social-url').addEventListener('input', updatePreview);
        socialItem.querySelector('.remove-social').addEventListener('click', function() {
            socialItem.remove();
            updatePreview();
        });
        
        document.getElementById('socialLinksContainer').appendChild(clone);
        updatePreview();
    }

    // Drag and drop handlers
    function handleDragStart(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        
        const container = document.getElementById('bioLinkContainer');
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
        
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        updatePreview();
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.link-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Update live preview
    function updatePreview() {
        const title = document.getElementById('bioTitle').value || 'Your Name';
        const description = document.getElementById('bioDescription').value || 'Your description';
        
        document.getElementById('preview-title').textContent = title;
        document.getElementById('preview-description').textContent = description;
        
        // Update links preview
        const previewLinks = document.getElementById('preview-links');
        previewLinks.innerHTML = '';
        
        document.querySelectorAll('#bioLinkContainer .link-item').forEach(linkItem => {
            const title = linkItem.querySelector('.link-title').value;
            const url = linkItem.querySelector('.link-url').value;
            const enabled = linkItem.querySelector('.link-enabled').checked;
            
            if (title && url && enabled) {
                const previewLink = document.createElement('div');
                previewLink.className = 'preview-link';
                previewLink.innerHTML = \`
                    <span class="preview-link-icon">🔗</span>
                    <div class="flex-grow">
                        <div class="font-semibold text-gray-800">\${title}</div>
                    </div>
                \`;
                previewLinks.appendChild(previewLink);
            }
        });
        
        // Update social preview
        const previewSocial = document.getElementById('preview-social');
        previewSocial.innerHTML = '';
        
        document.querySelectorAll('#socialLinksContainer .link-item').forEach(socialItem => {
            const platform = socialItem.querySelector('.social-platform').value;
            const url = socialItem.querySelector('.social-url').value;
            
            if (platform && url) {
                const socialIcon = document.createElement('div');
                socialIcon.className = 'preview-social-icon';
                socialIcon.innerHTML = getSocialIcon(platform);
                previewSocial.appendChild(socialIcon);
            }
        });
    }

    function getSocialIcon(platform) {
        const icons = {
            'twitter': '🐦',
            'instagram': '📷',
            'facebook': '👤',
            'linkedin': '💼',
            'youtube': '📺',
            'tiktok': '🎵',
            'github': '💻',
        };
        return icons[platform.toLowerCase()] || '🔗';
    }

    // OG Image preview
    document.getElementById('ogImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('ogImagePreview');
        
        if (file) {
            currentOgImageFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            currentOgImageFile = null;
        }
    });

    // Upload OG Image
    async function uploadOgImage(file) {
        const formData = new FormData();
        formData.append('ogImage', file);
        
        try {
            const response = await fetch('/api/bio/og-image', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.imageUrl;
                }
            }
            throw new Error('Failed to upload OG image');
        } catch (error) {
            console.error('Error uploading OG image:', error);
            throw error;
        }
    }

    // Form submission
    document.getElementById('bioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const customCode = document.querySelector('#customCode').value.trim();
        const bioTitle = document.querySelector('#bioTitle').value.trim();
        const bioDescription = document.querySelector('#bioDescription').value.trim();
        const metaTitle = document.querySelector('#metaTitle').value.trim();
        const metaDescription = document.querySelector('#metaDescription').value.trim();
        const metaTags = document.querySelector('#metaTags').value.trim();
        
        // Collect all bio links
        const links = [];
        document.querySelectorAll('#bioLinkContainer .link-item').forEach((linkItem, index) => {
            const title = linkItem.querySelector('.link-title').value.trim();
            const url = linkItem.querySelector('.link-url').value.trim();
            const enabled = linkItem.querySelector('.link-enabled').checked;
            
            if (title && url) {
                links.push({
                    title,
                    url,
                    enabled,
                    order_index: index
                });
            }
        });
        
        // Collect social media links
        const socialMedia = {};
        document.querySelectorAll('#socialLinksContainer .link-item').forEach(item => {
            const platform = item.querySelector('.social-platform').value.trim();
            const url = item.querySelector('.social-url').value.trim();
            
            if (platform && url) {
                socialMedia[platform] = { url: url };
            }
        });
        
        if (!customCode || !bioTitle) {
            alert('Please fill in the bio page URL and title.');
            return;
        }
        
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = isEditing ? 'Updating...' : 'Creating...';
        submitButton.disabled = true;

        try {
            let ogImageUrl = null;
            
            if (currentOgImageFile) {
                try {
                    ogImageUrl = await uploadOgImage(currentOgImageFile);
                } catch (error) {
                    console.error('Failed to upload OG image:', error);
                }
            }

            const body = JSON.stringify({
                shortcode: customCode,
                title: bioTitle,
                description: bioDescription,
                links: links,
                socialMedia: socialMedia,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                metaTags: metaTags || null,
                ogImageUrl: ogImageUrl
            });

            const response = await fetch('/api/bio/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            const data = await response.json();
            const successAlert = document.querySelector('#success-alert');
            const successMessage = document.querySelector('#success-message');
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to save bio page');
            }
            
            const shortUrl = 'https://${shortDomain}/' + data.shortcode;
            successMessage.textContent = (isEditing ? 'Bio page updated: ' : 'Bio page created: ') + shortUrl;
            successAlert.classList.remove('hidden');
            
            const copyButton = document.querySelector('#copy-button');
            copyButton.style.display = 'flex';
            copyButton.setAttribute('data-clipboard-text', shortUrl);
            
            const initClipboard = () => {
                if (typeof ClipboardJS !== 'undefined') {
                    const clipboard = new ClipboardJS('#copy-button');
                    clipboard.on('success', function(e) {
                        const originalText = copyButton.innerHTML;
                        copyButton.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copied!';
                        setTimeout(() => {
                            copyButton.innerHTML = originalText;
                        }, 2000);
                    });
                } else {
                    setTimeout(initClipboard, 100);
                }
            };
            initClipboard();
            
            if (!isEditing) {
                isEditing = true;
                document.getElementById('submit-text').textContent = 'Update Bio Page';
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error saving bio page:', error);
            alert('Error saving bio page: ' + error.message);
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Event listeners
    document.getElementById('addLinkBtn').addEventListener('click', () => addBioLink());
    document.getElementById('addSocialBtn').addEventListener('click', () => addSocialLink());
    document.getElementById('bioTitle').addEventListener('input', updatePreview);
    document.getElementById('bioDescription').addEventListener('input', updatePreview);

    // Load user profile picture for preview
    async function loadUserProfile() {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user && data.user.profile_picture_url) {
                    document.getElementById('preview-avatar').src = data.user.profile_picture_url;
                }
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    // Initialize
    loadBioData();
    loadUserProfile();
    `;
}

export { renderBioEditorUI, renderBioEditorScripts };
