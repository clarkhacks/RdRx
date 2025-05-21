interface CreateFormUIProps {
	shortcode?: string;
	shortcodeValue?: string;
}

function renderCreateFormUI({ shortcode, shortcodeValue }: CreateFormUIProps = {}): string {
	return `
<!-- Add gradient styles -->
<style>
  .gradient-text {
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-bg {
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
  }
  
  .form-card {
    transition: all 0.3s ease;
    border-top: 4px solid transparent;
    border-image: linear-gradient(to right, #0ea5e9, #ec4899);
    border-image-slice: 1;
  }
  
  .input-focus:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(236, 72, 153, 0.2);
  }
  
  .btn-gradient {
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    transition: all 0.3s ease;
  }
  
  .btn-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
</style>

<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-3xl mx-auto form-card">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2 gradient-text">Create Short URL</h1>
    <p class="text-gray-500">Customize and create a memorable shortened URL</p>
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
          class="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg input-focus text-gray-900 placeholder-gray-400 transition">
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
            class="pl-[72px] block w-full px-4 py-3 border border-gray-300 rounded-lg input-focus text-gray-900 transition">
        </div>
        <button type="button" class="ml-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
          onclick="document.querySelector('#customCode').value = Math.random().toString(36).substr(2, 6);">
          Random
        </button>
      </div>
    </div>

    <!-- Delete After Date -->
    <div>
      <div class="flex items-center space-x-2 mb-1">
        <input type="checkbox" id="deleteDate" name="deleteDate"
          class="h-4 w-4 text-primary-500 rounded focus:ring-primary-500">
        <label for="deleteDate" class="text-sm font-medium text-gray-700">Set expiration date</label>
      </div>
      <input type="date" id="deleteAfter" name="deleteAfter" disabled
        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg input-focus text-gray-900 transition">
    </div>

    <!-- Admin Override Code -->
    <div>
      <label for="adminOverrideCode" class="block text-sm font-medium text-gray-700 mb-1">Admin Override Code (optional)</label>
      <input type="text" id="adminOverrideCode" name="adminOverrideCode"
        placeholder="Only needed for overwriting existing URLs"
        class="block w-full px-4 py-3 border border-gray-300 rounded-lg input-focus text-gray-900 placeholder-gray-400 transition">
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <button type="submit"
        class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
        Create Short URL
      </button>
    </div>
  </form>
</div>
  `;
}

function renderCreateFormScripts(): string {
	return `
  // Add hover effects to inputs
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.add('shadow-md');
    });
    input.addEventListener('blur', () => {
      input.classList.remove('shadow-md');
    });
  });

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
      document.querySelector('#deleteDate').checked = false;
      document.querySelector('#deleteAfter').value = '';
      document.querySelector('#deleteAfter').disabled = true;
    }

    const customBody = function() {
      const body = {
        url: longUrl,
        custom: true,
        custom_code: customCode,
        userId: Clerk.user ? Clerk.user.id : null, // Add the user ID from Clerk
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
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: customBody(),
      });

      const data = await response.json();
      const successAlert = document.querySelector('#success-alert');
      const successMessage = document.querySelector('#success-message');

      if (data.message === 'Short URL overwritten') {
        successMessage.textContent = 'Short URL overwritten: rdrx.co/' + data.shortcode;
        successAlert.classList.remove('hidden');
        clearForm();
      } else if (response.status === 409) {
        alert('Shortcode already exists, requires admin override code');
      } else {
        successMessage.textContent = 'Short URL created: rdrx.co/' + data.shortcode;
        successAlert.classList.remove('hidden');
        clearForm();
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
