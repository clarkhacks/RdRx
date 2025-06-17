function renderUploadFormUI(): string {
	return `
<div class="max-w-4xl mx-auto">
  <!-- Header Section -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">Upload Files</h1>
    <p class="text-gray-600 dark:text-dark-300">Share files easily with a custom short link</p>
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
    
      <form id="uploadForm" class="space-y-6" enctype="multipart/form-data">
        <!-- File Upload Area -->
        <div>
          <label for="files" class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Select Files
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-600 border-dashed rounded-github-lg hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-dark-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 dropzone">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-dark-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-dark-300 justify-center">
                <label for="files" class="relative cursor-pointer bg-white dark:bg-dark-800 rounded-github font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 px-2 py-1 transition-colors duration-200">
                  <span>Upload files</span>
                  <input id="files" name="files" type="file" class="sr-only" multiple required>
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500 dark:text-dark-400">
                Any file type up to 10MB each
              </p>
            </div>
          </div>
          <div id="fileList" class="mt-3 text-sm text-gray-600 dark:text-dark-300"></div>
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
              rdrx.co/
            </div>
            <input 
              type="text" 
              id="customCode" 
              name="customCode"
              placeholder="my-files"
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
              Password protect these files
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
            <p class="text-xs text-gray-500 dark:text-dark-400 mt-1">Users will need to enter this password to access the files.</p>
          </div>
        </div>
        
        <!-- Progress Container -->
        <div id="progressContainer" class="space-y-2"></div>

        <!-- Submit Button -->
        <div class="pt-6">
          <button 
            type="submit"
            class="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github shadow-github hover:shadow-github-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Upload Files
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    `;
}

function renderUploadFormScripts(): string {
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
    
    // File input preview with enhanced styling
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('fileList');
    const dropzone = document.querySelector('.dropzone');
    
    // Add drag and drop highlight
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-primary-50');
        dropzone.classList.add('border-primary-300');
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-primary-50');
        dropzone.classList.remove('border-primary-300');
      });
    });
    
    // Handle file drop
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
      }
    });
    
    fileInput.addEventListener('change', () => {
        fileList.innerHTML = '';
        const files = fileInput.files;
        
        if (files.length > 0) {
            const fileCountText = document.createElement('p');
            fileCountText.className = 'font-medium text-primary-600 mb-2';
            fileCountText.textContent = \`Selected \${files.length} file\${files.length > 1 ? 's' : ''}\`;
            fileList.appendChild(fileCountText);
            
            for (let i = 0; i < Math.min(files.length, 5); i++) {
                const file = files[i];
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center mt-2 p-2 bg-gray-50 rounded-github-md hover:bg-gray-100 transition';
                fileItem.innerHTML = \`
                    <svg class="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">\${file.name}</span>
                    <span class="text-xs text-gray-500 ml-2">(\${(file.size / 1024).toFixed(1)} KB)</span>
                \`;
                fileList.appendChild(fileItem);
            }
            
            if (files.length > 5) {
                const moreFiles = document.createElement('p');
                moreFiles.className = 'text-sm mt-2 text-gray-500 italic';
                moreFiles.textContent = \`And \${files.length - 5} more file\${files.length - 5 > 1 ? 's' : ''}...\`;
                fileList.appendChild(moreFiles);
            }
        }
    });

    document.getElementById('uploadForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const files = document.querySelector('#files').files;
        const customCode = document.querySelector('#customCode').value;
        const deleteDateCheckbox = document.querySelector('#deleteDate').checked;
        const deleteAfter = document.querySelector('#deleteAfter').value;
        const progressContainer = document.getElementById('progressContainer');
        const successAlert = document.querySelector('#success-alert');
        const successMessage = document.querySelector('#success-message');
        
        progressContainer.innerHTML = '';

        // Create a single FormData object for all files
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('customCode', customCode);
        formData.append('deleteDate', deleteDateCheckbox ? 'true' : 'false');
        if (deleteDateCheckbox && deleteAfter) {
            formData.append('deleteAfter', deleteAfter);
        }
        
        // Add password protection if enabled
        const passwordProtected = document.querySelector('#passwordProtected').checked;
        if (passwordProtected) {
            const password = document.querySelector('#password').value;
            if (password) {
                formData.append('password_protected', 'true');
                formData.append('password', password);
            }
        }

        // Create a single progress bar for all files
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'w-full bg-white p-4 rounded-github-md shadow-sm border border-gray-100';

        const label = document.createElement('p');
        label.textContent = 'Uploading ' + files.length + ' file' + (files.length > 1 ? 's' : '');
        label.className = 'text-sm font-medium text-gray-700 mb-2';

        const progressBar = document.createElement('div');
        progressBar.className = 'w-full bg-gray-200 rounded-full h-4 overflow-hidden';
        progressBar.innerHTML = '<div class="progress-gradient h-4 transition-all duration-200 ease-in-out" style="width: 0%"></div>';

        progressWrapper.appendChild(label);
        progressWrapper.appendChild(progressBar);
        progressContainer.appendChild(progressWrapper);
        
        // Show loading state on the button
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Uploading...';
        submitButton.disabled = true;
        submitButton.classList.add('opacity-75');

        try {
            const response = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload');

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        progressBar.firstChild.style.width = percent + '%';
                        label.textContent = 'Uploading ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' - ' + Math.round(percent) + '%';
                    }
                });

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(data);
                        } catch (e) {
                            reject('Invalid response');
                        }
                    } else {
                        try {
                            const err = JSON.parse(xhr.responseText);
                            showModal('Upload Error', 'Error uploading files: ' + err.message);
                        } catch {
                            showModal('Upload Error', 'Unknown error uploading files.');
                        }
                        reject();
                    }
                };

                xhr.onerror = () => reject('Network error');
                xhr.send(formData);
            });

            // Display success message
            const shortUrl = 'https://rdrx.co/' + response.shortcode;
            successMessage.textContent = 'Files uploaded successfully: ' + shortUrl;
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
            
            // Clear form
            document.querySelector('#files').value = '';
            document.querySelector('#customCode').value = '';
            document.querySelector('#fileList').innerHTML = '';
            
            // Reset expiry fields to defaults
            document.querySelector('#deleteDate').checked = true;
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            document.querySelector('#deleteAfter').value = defaultDate.toISOString().split('T')[0];
            document.querySelector('#deleteAfter').disabled = false;

            // Show success modal with link
            const linkUrl = 'https://rdrx.co/' + response.shortcode;
            showModal('Upload Complete', 'All ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded successfully.', linkUrl);
            
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Upload failed:', error);
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

export { renderUploadFormUI, renderUploadFormScripts };
