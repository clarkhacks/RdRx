interface CreateFormUIProps {
	shortcode?: string;
	shortcodeValue?: string;
	isAdmin?: boolean;
	shortDomain?: string;
}

function renderCreateFormUI({ shortcode, shortcodeValue, isAdmin = false, shortDomain }: CreateFormUIProps = {}): string {
	return `
<div class="max-w-4xl mx-auto">
  <!-- Header Section -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">Create Short URL</h1>
    <p class="text-gray-600 dark:text-dark-300">Transform long URLs into short, memorable links</p>
  </div>

  <!-- Success Alert -->
  <div class="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-github-md p-4 mb-6 hidden" id="success-alert">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span id="success-message" class="text-accent-700 dark:text-accent-300 font-medium"></span>
      </div>
      <button id="copy-button" class="ml-4 px-3 py-1.5 bg-accent-100 dark:bg-accent-800 hover:bg-accent-200 dark:hover:bg-accent-700 text-accent-700 dark:text-accent-300 text-sm rounded-github transition-colors duration-200 flex items-center gap-2" style="display: none;">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
        </svg>
        Copy
      </button>
    </div>
  </div>

  <!-- Main Form Card -->
  <div class="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-github-lg shadow-github-md dark:shadow-github-dark">
    <div class="p-6">
  
      <form id="shortUrlForm" class="space-y-6">
        <!-- Long URL Input -->
        <div>
          <label for="longUrl" class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            Long URL
          </label>
          <input 
            type="url" 
            id="longUrl" 
            name="longUrl" 
            required
            ${shortcodeValue ? `value="${shortcodeValue}"` : ''}
            placeholder="https://example.com/your-very-long-url-here"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          >
        </div>

        <!-- Custom Path Input -->
        <div>
          <label for="customCode" class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Custom Path (optional)
          </label>
          <div class="flex">
            <div class="flex items-center px-3 py-2 bg-gray-50 dark:bg-dark-600 border border-r-0 border-gray-300 dark:border-dark-600 rounded-l-github text-gray-600 dark:text-dark-300 text-sm font-mono">
              ${shortDomain}/
            </div>
            <input 
              type="text" 
              id="customCode" 
              name="customCode"
              ${shortcode ? `value="${shortcode}"` : ''}
              placeholder="my-custom-link"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
            <button 
              type="button" 
              class="px-4 py-2 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 border border-l-0 border-gray-300 dark:border-dark-600 rounded-r-github text-gray-700 dark:text-dark-300 text-sm font-medium transition-colors duration-200"
              onclick="document.querySelector('#customCode').value = Math.random().toString(36).substr(2, 8);"
            >
              Random
            </button>
          </div>
        </div>

        <!-- Expiration Date -->
        <div>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="deleteDate" 
              name="deleteDate" 
              checked
              class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-dark-600 rounded"
            >
            <label for="deleteDate" class="ml-2 text-sm font-semibold text-gray-900 dark:text-dark-100">
              <svg class="w-4 h-4 inline mr-1 text-gray-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Set expiration date (default: 30 days)
            </label>
          </div>
          <input 
            type="date" 
            id="deleteAfter" 
            name="deleteAfter"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          >
        </div>
        
        <!-- Password Protection -->
        <div>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="passwordProtected" 
              name="passwordProtected"
              class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-dark-600 rounded"
            >
            <label for="passwordProtected" class="ml-2 text-sm font-semibold text-gray-900 dark:text-dark-100">
              <svg class="w-4 h-4 inline mr-1 text-gray-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Password protect this URL
            </label>
          </div>
          <div id="passwordContainer" class="hidden">
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter a secure password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
            <p class="text-xs text-gray-500 dark:text-dark-400 mt-1">Users will need to enter this password to access the content.</p>
          </div>
        </div>

        ${
					isAdmin
						? `
        <!-- Admin Override Code (only shown to admins) -->
        <div class="border-t border-gray-200 dark:border-dark-600 pt-6">
          <label for="adminOverrideCode" class="block text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Admin Override Code (optional)
          </label>
          <input 
            type="text" 
            id="adminOverrideCode" 
            name="adminOverrideCode"
            placeholder="Only needed for overwriting existing URLs"
            class="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-github bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-dark-100 placeholder-red-400 dark:placeholder-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
          >
        </div>
        `
						: ''
				}

        <!-- Submit Button -->
        <div class="pt-6">
          <button 
            type="submit"
            class="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github shadow-github hover:shadow-github-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            Create Short URL
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  `;
}

function renderCreateFormScripts(shortDomain: string): string {
	return `
  // Load clipboard.js
  const clipboardScript = document.createElement('script');
  clipboardScript.src = '/assets/clipboard.min.js';
  document.head.appendChild(clipboardScript);

  // Add hover effects to inputs
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.add('shadow-md');
    });
    input.addEventListener('blur', () => {
      input.classList.remove('shadow-md');
    });
  });

  // Set default expiration date to 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  document.querySelector('#deleteAfter').value = defaultDate.toISOString().split('T')[0];
  
  // Toggle password field visibility
  document.querySelector('#passwordProtected').addEventListener('change', function() {
    const passwordContainer = document.querySelector('#passwordContainer');
    if (this.checked) {
      passwordContainer.classList.remove('hidden');
    } else {
      passwordContainer.classList.add('hidden');
      document.querySelector('#password').value = '';
    }
  });

  document.getElementById('shortUrlForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const customCode = document.querySelector('#customCode').value;
    const longUrl = document.querySelector('#longUrl').value;
    const adminOverrideCodeInput = document.querySelector('#adminOverrideCode');
    const adminOverrideCode = adminOverrideCodeInput ? adminOverrideCodeInput.value : '';
    const deleteDateCheckbox = document.querySelector('#deleteDate').checked;
    const deleteAfter = document.querySelector('#deleteAfter').value;

    console.log('Checkbox checked:', deleteDateCheckbox);
    console.log('Delete after date:', deleteAfter);

    function clearForm() {
      document.querySelector('#customCode').value = '';
      document.querySelector('#longUrl').value = '';
      if (document.querySelector('#adminOverrideCode')) {
        document.querySelector('#adminOverrideCode').value = '';
      }
      
      // Reset expiry fields to defaults
      document.querySelector('#deleteDate').checked = true;
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      document.querySelector('#deleteAfter').value = defaultDate.toISOString().split('T')[0];
      document.querySelector('#deleteAfter').disabled = false;
    }

    const customBody = function() {
      const body = {
        url: longUrl,
        custom: true,
        custom_code: customCode,
      };
      
      if (adminOverrideCode.length > 0) {
        body.admin_override_code = adminOverrideCode;
      }
      if (deleteDateCheckbox && deleteAfter) {
        body.delete_after = deleteAfter;
      }
      
      // Add password protection if enabled
      const passwordProtected = document.querySelector('#passwordProtected').checked;
      if (passwordProtected) {
        const password = document.querySelector('#password').value;
        if (password) {
          body.password_protected = true;
          body.password = password;
        }
      }
      
      return JSON.stringify(body);
    };

    // Show loading state on the button
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Creating...';
    submitButton.disabled = true;
    submitButton.classList.add('opacity-75');

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: customBody(),
      });

      const successAlert = document.querySelector('#success-alert');
      const successMessage = document.querySelector('#success-message');

      if (response.ok) {
        const data = await response.json();
        
        if (data.message === 'Short URL overwritten') {
          const shortUrl = 'https://${shortDomain}/' + data.shortcode;
          successMessage.textContent = 'Short URL overwritten: ' + shortUrl;
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
          
          clearForm();
        } else if (data.shortcode) {
          const shortUrl = 'https://${shortDomain}/' + data.shortcode;
          successMessage.textContent = 'Short URL created: ' + shortUrl;
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
          
          clearForm();
        } else {
          alert('Error: Unexpected response format');
        }
      } else if (response.status === 409) {
        alert('Shortcode already exists, requires admin override code');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        alert('Error creating short URL: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
      alert('An error occurred while creating the short URL. Please try again.');
    } finally {
      // Restore button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-75');
    }
  });

  const deleteAfterCheck = document.querySelector('#deleteDate');
  const deleteAfter = document.querySelector('#deleteAfter');
  deleteAfterCheck.addEventListener('change', () => {
    deleteAfter.disabled = !deleteAfterCheck.checked;
  });
  `;
}

export { renderCreateFormUI, renderCreateFormScripts };
