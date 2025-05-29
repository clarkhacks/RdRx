interface CreateFormUIProps {
	shortcode?: string;
	shortcodeValue?: string;
}

function renderCreateFormUI({ shortcode, shortcodeValue }: CreateFormUIProps = {}): string {
	return `
<!-- Add gradient styles -->
<style>
  .gradient-text {
    background: linear-gradient(90deg, #FFC107, #FF8A00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #FFD54F, #FF9800);
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
</style>

<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-3xl mx-auto form-card">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2 gradient-text">Create Short URL</h1>
    <p class="text-gray-500">Customize and create a memorable shortened URL</p>
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
  
  <form id="shortUrlForm" class="space-y-6">
    <!-- Long URL -->
    <div>
      <label for="longUrl" class="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <input type="url" id="longUrl" name="longUrl" required
          ${shortcodeValue ? `value="${shortcodeValue}"` : ''}
          placeholder="https://example.com/your-long-url"
          class="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 placeholder-gray-400 transition">
      </div>
    </div>

    <!-- Custom Code -->
    <div>
      <label for="customCode" class="block text-sm font-medium text-gray-700 mb-1">Custom Path</label>
      <div class="flex items-start">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 font-medium">
            rdrx.co/
          </div>
          <input type="text" id="customCode" name="customCode"
            ${shortcode ? `value="${shortcode}"` : ''}
            placeholder="your-custom-path"
            class="pl-[72px] block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
        </div>
        <button type="button" class="ml-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
          onclick="document.querySelector('#customCode').value = Math.random().toString(36).substr(2, 6);">
          Random
        </button>
      </div>
    </div>

    <!-- Delete After Date -->
    <div>
      <div class="flex items-center space-x-2 mb-1">
        <input type="checkbox" id="deleteDate" name="deleteDate" checked
          class="h-4 w-4 text-primary-500 rounded focus:ring-primary-500">
        <label for="deleteDate" class="text-sm font-medium text-gray-700">Set expiration date (default: 30 days)</label>
      </div>
      <input type="date" id="deleteAfter" name="deleteAfter"
        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
    </div>

    <!-- Admin Override Code -->
    <div>
      <label for="adminOverrideCode" class="block text-sm font-medium text-gray-700 mb-1">Admin Override Code (optional)</label>
      <input type="text" id="adminOverrideCode" name="adminOverrideCode"
        placeholder="Only needed for overwriting existing URLs"
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 placeholder-gray-400 transition">
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <button type="submit"
        class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
        Create Short URL
      </button>
    </div>
  </form>
</div>
  `;
}

function renderCreateFormScripts(): string {
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

  document.getElementById('shortUrlForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const customCode = document.querySelector('#customCode').value;
    const longUrl = document.querySelector('#longUrl').value;
    const adminOverrideCode = document.querySelector('#adminOverrideCode').value;
    const deleteDateCheckbox = document.querySelector('#deleteDate').checked;
    const deleteAfter = document.querySelector('#deleteAfter').value;

    console.log('Checkbox checked:', deleteDateCheckbox);
    console.log('Delete after date:', deleteAfter);

    function clearForm() {
      document.querySelector('#customCode').value = '';
      document.querySelector('#longUrl').value = '';
      document.querySelector('#adminOverrideCode').value = '';
      
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
          const shortUrl = 'https://rdrx.co/' + data.shortcode;
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
          const shortUrl = 'https://rdrx.co/' + data.shortcode;
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
