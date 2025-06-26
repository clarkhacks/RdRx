interface BioFormUIProps {
	shortcode?: string;
	shortcodeValue?: string;
	shortDomain?: string;
}

function renderBioFormUI(props: BioFormUIProps = {}): string {
	const { shortcode, shortcodeValue, shortDomain } = props;

	return `
<!-- Add gradient styles -->
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
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
  }
  
  .link-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .icon-picker {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  .icon-option {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
  }
  
  .icon-option:hover {
    background: #e9ecef;
    transform: scale(1.1);
  }
  
  .icon-option.selected {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
</style>

<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-4xl mx-auto form-card">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2 gradient-text">My Bio Page</h1>
      <p class="text-gray-500">Create and manage your link-in-bio style page</p>
    </div>
    
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
    
    <form id="bioForm" class="space-y-6" style="display: none;">
        <!-- Custom Code -->
        <div>
            <label for="customCode" class="block text-sm font-medium text-gray-700 mb-1">Bio Page URL</label>
            <div class="flex items-start">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 font-medium">
                    ${shortDomain}/
                  </div>
                  <input type="text" id="customCode" name="customCode"
                    placeholder="your-bio-page"
                    class="pl-[72px] block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                </div>
                <button type="button" class="ml-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
                  onclick="document.querySelector('#customCode').value = Math.random().toString(36).substr(2, 8);">
                  Random
                </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">This will be your bio page URL. You can change it anytime. It will render at /bio-view/your-user-id</p>
        </div>

        <!-- Bio Page Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="bioTitle" class="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input type="text" id="bioTitle" name="bioTitle" placeholder="Your Name or Brand"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
            </div>
            <div>
                <label for="bioDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" id="bioDescription" name="bioDescription" placeholder="What you do or your tagline"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
            </div>
        </div>

        <!-- Bio Link Section -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <label class="block text-sm font-medium text-gray-700">Your Bio Link</label>
                <p class="text-sm text-gray-500">You can have one main bio link</p>
            </div>
            <div id="bioLinkContainer">
                <!-- Bio link will be added here -->
            </div>
        </div>

        <!-- Social Media Icons Section -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <label class="block text-sm font-medium text-gray-700">Social Media Links</label>
                <button type="button" id="addSocialBtn" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    + Add Social Link
                </button>
            </div>
            <div id="socialLinksContainer">
                <!-- Social links will be added here dynamically -->
            </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
            <button type="submit"
                    class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
                <span id="submit-text">Save Bio Page</span>
            </button>
        </div>
    </form>
</div>

<!-- Link Template (hidden) -->
<template id="linkTemplate">
    <div class="link-item" data-link-index="">
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer link-icon" onclick="openIconPicker(this)">
                    <span class="text-2xl">🔗</span>
                </div>
                <input type="hidden" class="link-icon-value" value="🔗">
            </div>
            <div class="flex-grow space-y-3">
                <div>
                    <input type="text" placeholder="Link Title" class="link-title w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <input type="url" placeholder="https://example.com" class="link-url w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <input type="text" placeholder="Optional description" class="link-description w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            </div>
            <div class="flex-shrink-0 flex flex-col gap-2">
                <button type="button" class="text-gray-400 hover:text-gray-600 move-up" onclick="moveLinkUp(this)" title="Move Up">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
                <button type="button" class="text-gray-400 hover:text-gray-600 move-down" onclick="moveLinkDown(this)" title="Move Down">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
                <button type="button" class="text-red-400 hover:text-red-600 remove-link" onclick="removeLink(this)" title="Remove">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<!-- Social Link Template (hidden) -->
<template id="socialLinkTemplate">
    <div class="social-link-item bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer social-icon-display" onclick="openSocialIconPicker(this)">
                    <img class="w-6 h-6 social-icon-img" src="" alt="" style="display: none;">
                    <span class="text-gray-400 text-sm">Icon</span>
                </div>
                <input type="hidden" class="social-icon-value" value="">
            </div>
            <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <input type="text" placeholder="Platform name (e.g., Twitter)" class="social-platform w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <input type="url" placeholder="https://platform.com/username" class="social-url w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            </div>
            <div class="flex-shrink-0">
                <button type="button" class="text-red-400 hover:text-red-600 remove-social" onclick="removeSocialLink(this)" title="Remove">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<!-- Icon Picker Modal -->
<div id="iconPickerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Choose an Icon</h3>
            <button onclick="closeIconPicker()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
        <div class="icon-picker" id="iconPicker">
            <!-- Icons will be populated here -->
        </div>
    </div>
</div>

<!-- Social Icon Picker Modal -->
<div id="socialIconPickerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Choose Social Icon</h3>
            <button onclick="closeSocialIconPicker()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
        <div class="mb-4">
            <input type="text" id="iconSearchInput" placeholder="Search for icons..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div class="social-icon-picker grid grid-cols-5 gap-2 max-h-60 overflow-y-auto" id="socialIconPicker">
            <!-- Icons will be populated here -->
        </div>
    </div>
</div>
    `;
}

function renderBioFormScripts(shortDomain: string): string {
	return `
    // Load clipboard.js
    const clipboardScript = document.createElement('script');
    clipboardScript.src = '/assets/clipboard.min.js';
    document.head.appendChild(clipboardScript);

    // Common icons for bio pages
    const commonIcons = [
        '🔗', '🌐', '📱', '💼', '📧', '📞', '🏠', '🎵', '🎥', '📸', 
        '🎨', '✍️', '📝', '📚', '🎓', '💻', '⚡', '🚀', '💡', '🔥',
        '❤️', '⭐', '🌟', '🎯', '🏆', '🎪', '🎭', '🎨', '🎬', '📺',
        '🎮', '🕹️', '🎲', '🃏', '🎰', '🎪', '🎨', '🖼️', '🖌️', '✏️'
    ];

    let currentIconTarget = null;
    let linkCounter = 0;
    let isEditing = false;

    // Load existing bio page data
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
            document.getElementById('bioForm').style.display = 'block';
            
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
        
        // Populate social media links dynamically
        Object.entries(socialMedia).forEach(([platform, url]) => {
            if (url) {
                addSocialLink(platform, url);
            }
        });
        
        // Populate the single bio link
        if (links && links.length > 0) {
            addBioLink(links[0]);
        } else {
            addBioLink();
        }
    }

    // Add hover effects to inputs
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.classList.add('shadow-md');
      });
      input.addEventListener('blur', () => {
        input.classList.remove('shadow-md');
      });
    });

    // Initialize icon picker
    function initIconPicker() {
        const iconPicker = document.getElementById('iconPicker');
        iconPicker.innerHTML = '';
        
        commonIcons.forEach(icon => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-option';
            iconElement.textContent = icon;
            iconElement.onclick = () => selectIcon(icon);
            iconPicker.appendChild(iconElement);
        });
    }

    function openIconPicker(target) {
        currentIconTarget = target;
        document.getElementById('iconPickerModal').classList.remove('hidden');
        initIconPicker();
    }

    function closeIconPicker() {
        document.getElementById('iconPickerModal').classList.add('hidden');
        currentIconTarget = null;
    }

    function selectIcon(icon) {
        if (currentIconTarget) {
            currentIconTarget.querySelector('span').textContent = icon;
            currentIconTarget.parentElement.querySelector('.link-icon-value').value = icon;
        }
        closeIconPicker();
    }

    // Add single bio link
    function addBioLink(linkData = null) {
        // Clear existing bio link
        document.getElementById('bioLinkContainer').innerHTML = '';
        
        const template = document.getElementById('linkTemplate');
        const clone = template.content.cloneNode(true);
        const linkItem = clone.querySelector('.link-item');
        linkItem.setAttribute('data-link-index', 0);
        
        // Remove the move up/down buttons since there's only one link
        const moveButtons = linkItem.querySelectorAll('.move-up, .move-down');
        moveButtons.forEach(btn => btn.style.display = 'none');
        
        // Remove the remove button since they must have one link
        const removeButton = linkItem.querySelector('.remove-link');
        removeButton.style.display = 'none';
        
        if (linkData) {
            linkItem.querySelector('.link-title').value = linkData.title || '';
            linkItem.querySelector('.link-url').value = linkData.url || '';
            linkItem.querySelector('.link-description').value = linkData.description || '';
            linkItem.querySelector('.link-icon-value').value = linkData.icon || '🔗';
            linkItem.querySelector('.link-icon span').textContent = linkData.icon || '🔗';
        }
        
        document.getElementById('bioLinkContainer').appendChild(clone);
    }

    // Legacy function for compatibility (not used in new single-link system)
    function addLink(linkData = null) {
        addBioLink(linkData);
    }

    function removeLink(button) {
        const linkItem = button.closest('.link-item');
        linkItem.remove();
        updateLinkButtons();
    }

    function moveLinkUp(button) {
        const linkItem = button.closest('.link-item');
        const prevItem = linkItem.previousElementSibling;
        if (prevItem) {
            linkItem.parentNode.insertBefore(linkItem, prevItem);
        }
        updateLinkButtons();
    }

    function moveLinkDown(button) {
        const linkItem = button.closest('.link-item');
        const nextItem = linkItem.nextElementSibling;
        if (nextItem) {
            linkItem.parentNode.insertBefore(nextItem, linkItem);
        }
        updateLinkButtons();
    }

    function updateLinkButtons() {
        const links = document.querySelectorAll('.link-item');
        links.forEach((link, index) => {
            const moveUpBtn = link.querySelector('.move-up');
            const moveDownBtn = link.querySelector('.move-down');
            
            moveUpBtn.style.opacity = index === 0 ? '0.3' : '1';
            moveUpBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
            
            moveDownBtn.style.opacity = index === links.length - 1 ? '0.3' : '1';
            moveDownBtn.style.pointerEvents = index === links.length - 1 ? 'none' : 'auto';
        });
    }

    // Form submission
    document.getElementById('bioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const customCode = document.querySelector('#customCode').value.trim();
        const bioTitle = document.querySelector('#bioTitle').value.trim();
        const bioDescription = document.querySelector('#bioDescription').value.trim();
        
        // Collect the single bio link
        const links = [];
        const linkItem = document.querySelector('#bioLinkContainer .link-item');
        if (linkItem) {
            const title = linkItem.querySelector('.link-title').value.trim();
            const url = linkItem.querySelector('.link-url').value.trim();
            const description = linkItem.querySelector('.link-description').value.trim();
            const icon = linkItem.querySelector('.link-icon-value').value;
            
            if (title && url) {
                links.push({
                    title,
                    url,
                    description,
                    icon,
                    order_index: 0
                });
            }
        }
        
        // Collect social media links dynamically
        const socialMedia = {};
        document.querySelectorAll('.social-link-item').forEach(item => {
            const platform = item.querySelector('.social-platform').value.trim();
            const url = item.querySelector('.social-url').value.trim();
            const icon = item.querySelector('.social-icon-value').value;
            
            if (platform && url) {
                socialMedia[platform] = {
                    url: url,
                    icon: icon
                };
            }
        });
        
        if (!customCode || !bioTitle) {
            alert('Please fill in the bio page URL and title.');
            return;
        }
        
        // Show loading state on the button
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = isEditing ? 'Updating...' : 'Creating...';
        submitButton.disabled = true;
        submitButton.classList.add('opacity-75');

        try {
            const body = JSON.stringify({
                shortcode: customCode,
                title: bioTitle,
                description: bioDescription,
                links: links,
                socialMedia: socialMedia
            });

            const response = await fetch('/api/bio/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json();
            const successAlert = document.querySelector('#success-alert');
            const successMessage = document.querySelector('#success-message');

            // Get the shortDomain from the bio URL display
            const domain = '${shortDomain}';
            
            try {
                // Always check response.ok first (HTTP status code)
                if (!response.ok) {
                    console.error('HTTP error:', response.status);
                    throw new Error('HTTP ' + response.status);
                }
                
                // Parse the response data
                if (!data) {
                    console.error('No data returned from server');
                    throw new Error('No data returned from server');
                }
                
                // Check for application-level success
                if (!data.success) {
                    console.error('API error:', data.message);
                    throw new Error(data.message || 'Unknown error');
                }
                
                // Success path
                const shortUrl = 'https://' + domain + '/' + data.shortcode;
                successMessage.textContent = (isEditing ? 'Bio page updated: ' : 'Bio page created: ') + shortUrl;
                successAlert.classList.remove('hidden');
                
                // Show and setup copy button
                const copyButton = document.querySelector('#copy-button');
                copyButton.style.display = 'flex';
                copyButton.setAttribute('data-clipboard-text', shortUrl);
                
                // Initialize clipboard.js when available
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
                
                // Update editing state
                if (!isEditing) {
                    isEditing = true;
                    document.getElementById('submit-text').textContent = 'Update Bio Page';
                }
                
                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error in bio save:', error);
                // Only show alert in case of actual errors, not when the bio was created successfully
                if (!data || !data.success) {
                    alert('Error saving bio page: ' + (error.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error saving bio page:', error);
            alert('An error occurred while saving the bio page. Please try again.');
        } finally {
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-75');
        }
    });

    // Social media functions
    let currentSocialIconTarget = null;
    
    function addSocialLink(platform = '', url = '', icon = '') {
        const template = document.getElementById('socialLinkTemplate');
        const clone = template.content.cloneNode(true);
        const socialItem = clone.querySelector('.social-link-item');
        
        if (platform) socialItem.querySelector('.social-platform').value = platform;
        if (url) socialItem.querySelector('.social-url').value = url;
        if (icon) {
            socialItem.querySelector('.social-icon-value').value = icon;
            const iconImg = socialItem.querySelector('.social-icon-img');
            const iconText = socialItem.querySelector('.social-icon-display span');
            iconImg.src = 'https://icons.rdrx.co/' + icon;
            iconImg.style.display = 'block';
            iconText.style.display = 'none';
        }
        
        document.getElementById('socialLinksContainer').appendChild(clone);
    }
    
    function removeSocialLink(button) {
        const socialItem = button.closest('.social-link-item');
        socialItem.remove();
    }
    
    async function openSocialIconPicker(target) {
        currentSocialIconTarget = target;
        document.getElementById('socialIconPickerModal').classList.remove('hidden');
        
        // Load default icons
        await searchIcons('social');
        
        // Setup search functionality
        const searchInput = document.getElementById('iconSearchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchIcons(e.target.value);
            }, 300);
        });
    }
    
    function closeSocialIconPicker() {
        document.getElementById('socialIconPickerModal').classList.add('hidden');
        currentSocialIconTarget = null;
    }
    
    async function searchIcons(query) {
        try {
            const response = await fetch('https://icons.rdrx.co/search?q=' + encodeURIComponent(query));
            const icons = await response.json();
            
            // Filter to only PNG icons
            const pngIcons = icons.filter(icon => icon.type === 'png');
            
            const iconPicker = document.getElementById('socialIconPicker');
            iconPicker.innerHTML = '';
            
            pngIcons.slice(0, 10).forEach(icon => {
                const iconElement = document.createElement('div');
                iconElement.className = 'w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition';
                iconElement.innerHTML = '<img src="https://icons.rdrx.co/' + icon.name + '" alt="' + icon.name + '" class="w-8 h-8">';
                iconElement.onclick = () => selectSocialIcon(icon.name);
                iconPicker.appendChild(iconElement);
            });
        } catch (error) {
            console.error('Error searching icons:', error);
        }
    }
    
    function selectSocialIcon(iconName) {
        if (currentSocialIconTarget) {
            const iconImg = currentSocialIconTarget.querySelector('.social-icon-img');
            const iconText = currentSocialIconTarget.querySelector('span');
            const iconValue = currentSocialIconTarget.parentElement.querySelector('.social-icon-value');
            
            iconImg.src = 'https://icons.rdrx.co/' + iconName;
            iconImg.style.display = 'block';
            iconText.style.display = 'none';
            iconValue.value = iconName;
        }
        closeSocialIconPicker();
    }
    
    // Add social button event listener
    document.getElementById('addSocialBtn').addEventListener('click', () => {
        addSocialLink();
    });

    // Make functions global for onclick handlers
    window.openIconPicker = openIconPicker;
    window.closeIconPicker = closeIconPicker;
    window.selectIcon = selectIcon;
    window.removeLink = removeLink;
    window.moveLinkUp = moveLinkUp;
    window.moveLinkDown = moveLinkDown;
    window.addSocialLink = addSocialLink;
    window.removeSocialLink = removeSocialLink;
    window.openSocialIconPicker = openSocialIconPicker;
    window.closeSocialIconPicker = closeSocialIconPicker;

    // Load existing data on page load
    loadBioData();
    `;
}

export { renderBioFormUI, renderBioFormScripts };
