function renderUploadFormUI(): string {
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
  
  .dropzone {
    transition: all 0.3s ease;
    border: 2px dashed rgba(255, 193, 7, 0.4);
  }
  
  .dropzone:hover {
    border-color: #FFC107;
    background-color: rgba(255, 193, 7, 0.05);
  }
  
  .progress-gradient {
    background: linear-gradient(90deg, #FFC107, #FF8A00);
  }
</style>

<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-3xl mx-auto form-card">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2 gradient-text">Upload Files</h1>
      <p class="text-gray-500">Share files easily with a custom short link</p>
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
    
    <form id="uploadForm" class="space-y-6" enctype="multipart/form-data">
        <!-- File Input -->
        <div>
            <label for="files" class="block text-sm font-medium text-gray-700 mb-1">Select Files</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 dropzone rounded-xl hover:shadow-md transition">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-primary-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600 justify-center">
                  <label for="files" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-500 hover:text-primary-600 focus-within:outline-none transition">
                    <span>Upload files</span>
                    <input id="files" name="files" type="file" class="sr-only" multiple required>
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  Any file type up to 10MB
                </p>
              </div>
            </div>
            <div id="fileList" class="mt-3 text-sm text-gray-600"></div>
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
        
        <!-- Progress Container -->
        <div id="progressContainer" class="space-y-2"></div>

        <!-- Submit Button -->
        <div class="pt-4">
            <button type="submit"
                    class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
                Upload Files
            </button>
        </div>
    </form>
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
                fileItem.className = 'flex items-center mt-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition';
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

        // Create a single progress bar for all files
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100';

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
