interface SnippetFormUIProps {
	shortcode?: string;
	shortcodeValue?: string;
}

function renderSnippetFormUI(props: SnippetFormUIProps = {}): string {
	const { shortcode, shortcodeValue } = props;

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
      <h1 class="text-4xl font-bold mb-2 gradient-text">Create Code Snippet</h1>
      <p class="text-gray-500">Create and share code snippets easily</p>
    </div>
    
    <div class="success-gradient rounded-lg p-4 mb-6 hidden" id="success-alert">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span id="success-message" class="text-green-700 font-medium"></span>
      </div>
    </div>
    
    <form id="snippetForm" class="space-y-6">
        <!-- Custom Code -->
        <div>
            <label for="customCode" class="block text-sm font-medium text-gray-700 mb-1">Custom Code</label>
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

        <!-- Code Snippet -->
        <div>
            <label for="codeSnippet" class="block text-sm font-medium text-gray-700 mb-1">Code Snippet</label>
            <div class="relative">
              <textarea id="codeSnippet" name="codeSnippet" rows="10"
                      class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 font-mono transition bg-gray-50"></textarea>
              <div class="absolute top-2 right-2 flex space-x-2">
                <button type="button" class="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition" 
                  onclick="document.getElementById('codeSnippet').classList.toggle('bg-gray-900'); document.getElementById('codeSnippet').classList.toggle('text-gray-100'); document.getElementById('codeSnippet').classList.toggle('bg-gray-50');">
                  Toggle Theme
                </button>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">Paste your code snippet here. Supports any programming language.</p>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
            <button type="submit"
                    class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
                Create Code Snippet
            </button>
        </div>
    </form>
</div>
    `;
}

function renderSnippetFormScripts(): string {
	return `
    // Add hover effects to inputs
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.classList.add('shadow-md');
      });
      input.addEventListener('blur', () => {
        input.classList.remove('shadow-md');
      });
    });

    document.getElementById('snippetForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const customCode = document.querySelector('#customCode').value;
        const codeSnippet = document.querySelector('#codeSnippet').value;
        
        // Show loading state on the button
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Creating...';
        submitButton.disabled = true;
        submitButton.classList.add('opacity-75');

        try {
            const body = JSON.stringify({
                custom_code: customCode,
                custom: true,
                snippet: codeSnippet,
            });

            const response = await fetch('/snippet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json();
            const successAlert = document.querySelector('#success-alert');
            const successMessage = document.querySelector('#success-message');

            if (response.status === 200) {
                successMessage.textContent = 'Code Snippet created: rdrx.co/' + data.shortcode;
                successAlert.classList.remove('hidden');
                document.querySelector('#customCode').value = '';
                document.querySelector('#codeSnippet').value = '';
                
                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert('Error creating code snippet: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating code snippet:', error);
            alert('An error occurred while creating the code snippet. Please try again.');
        } finally {
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-75');
        }
    });
    `;
}

export { renderSnippetFormUI, renderSnippetFormScripts };
