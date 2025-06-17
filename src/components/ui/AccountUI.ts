import { User } from '../auth/types';

interface AccountUIProps {
	user: User;
	shortDomain: string;
}

function renderAccountUI({ user, shortDomain }: AccountUIProps): string {
	const profilePicture = user.profile_picture_url || 'https://via.placeholder.com/150';

	return `
<div class="max-w-6xl mx-auto py-8 px-4">
  <!-- Welcome Section -->
  <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 mb-8 border border-gray-200 dark:border-dark-600">
    <div class="flex items-center">
      <img src="${profilePicture}" alt="Profile Picture" class="w-20 h-20 rounded-full object-cover mr-6 border-4 border-gray-200 dark:border-dark-600">
      <div>
        <h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-dark-100">My Account</h1>
        <p class="text-gray-600 dark:text-dark-300">Manage your profile and account settings</p>
      </div>
    </div>
  </div>
  
  <!-- Account Sections -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Profile Picture Section -->
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-100">Profile Picture</h2>
      <div class="flex flex-col items-center">
        <img id="profile-picture" src="${profilePicture}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mb-6 border-4 border-gray-200 dark:border-dark-600">
        <form id="profile-picture-form" class="flex flex-col items-center w-full space-y-4">
          <label class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-github cursor-pointer transition-colors duration-200 text-center w-full">
            Choose Photo
            <input id="profile-picture-upload" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" class="hidden">
          </label>
          <button id="profile-upload-button" type="submit" class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200 w-full hidden">
            Save Photo
          </button>
          <button id="profile-cancel-button" type="button" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-github focus:outline-none transition-colors duration-200 w-full hidden">
            Cancel
          </button>
        </form>
        <p id="upload-status" class="mt-4 text-sm text-gray-600 dark:text-dark-300 text-center"></p>
      </div>
    </div>
    
    <!-- Profile Information Section -->
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600 lg:col-span-2">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-100">Profile Information</h2>
      <form id="update-profile-form" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2" for="name">
            Name
          </label>
          <input class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
            id="name" name="name" type="text" value="${user.name}" required>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2" for="email">
            Email
          </label>
          <input class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
            id="email" name="email" type="email" value="${user.email}" required>
        </div>
        <div class="flex items-center justify-between pt-4">
          <button class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200" 
            type="submit">
            Update Profile
          </button>
          <p id="profile-status" class="text-sm text-gray-600 dark:text-dark-300"></p>
        </div>
      </form>
    </div>
    
    <!-- Change Password Section -->
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600 lg:col-span-3">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-100">Change Password</h2>
      <form id="change-password-form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2" for="current_password">
              Current Password
            </label>
            <input class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
              id="current_password" name="current_password" type="password" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2" for="new_password">
              New Password
            </label>
            <input class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
              id="new_password" name="new_password" type="password" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-2" for="confirm_password">
              Confirm New Password
            </label>
            <input class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
              id="confirm_password" name="confirm_password" type="password" required>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <button class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200" 
            type="submit">
            Change Password
          </button>
          <p id="password-status" class="text-sm text-gray-600 dark:text-dark-300"></p>
        </div>
      </form>
    </div>
  </div>
</div>
  `;
}

function renderAccountScripts(shortDomain: string): string {
	return `
// Store original profile picture URL for cancel functionality
let originalProfilePicture = document.getElementById('profile-picture').src;

// Handle file selection
document.getElementById('profile-picture-upload').addEventListener('change', function(e) {
	const file = e.target.files[0];
	const uploadButton = document.getElementById('profile-upload-button');
	const cancelButton = document.getElementById('profile-cancel-button');
	const profilePicture = document.getElementById('profile-picture');
	
	if (file) {
		// Show preview of selected image
		const reader = new FileReader();
		reader.onload = function(e) {
			profilePicture.src = e.target.result;
		};
		reader.readAsDataURL(file);
		
		// Show Save and Cancel buttons
		uploadButton.classList.remove('hidden');
		cancelButton.classList.remove('hidden');
		
		// Clear any previous status messages
		document.getElementById('upload-status').textContent = '';
	}
});

// Handle cancel button
document.getElementById('profile-cancel-button').addEventListener('click', function() {
	// Reset to original image
	document.getElementById('profile-picture').src = originalProfilePicture;
	
	// Clear file input
	document.getElementById('profile-picture-upload').value = '';
	
	// Hide Save and Cancel buttons
	document.getElementById('profile-upload-button').classList.add('hidden');
	document.getElementById('profile-cancel-button').classList.add('hidden');
	
	// Clear status message
	document.getElementById('upload-status').textContent = '';
});

// Profile picture upload
document.getElementById('profile-picture-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const fileInput = document.getElementById('profile-picture-upload');
	const file = fileInput.files[0];
	if (!file) {
		document.getElementById('upload-status').textContent = 'Please select a file first';
		return;
	}
	
	const formData = new FormData();
	formData.append('file', file);
	
	try {
		document.getElementById('upload-status').textContent = 'Uploading...';
		document.getElementById('profile-upload-button').disabled = true;
		document.getElementById('profile-cancel-button').disabled = true;
		
		const response = await fetch('/api/auth/profile/picture', {
			method: 'POST',
			body: formData
		});
		
		if (!response.ok) {
			const text = await response.text();
			throw new Error('Server returned ' + response.status + ': ' + text);
		}
		
		const result = await response.json();
		if (result.success) {
			document.getElementById('upload-status').textContent = 'Upload successful!';
			const timestamp = new Date().getTime();
			
			let profilePicUrl = result.user.profile_picture_url;
			
			if (profilePicUrl.indexOf('?') === -1) {
				profilePicUrl += '?t=' + timestamp;
			} else {
				profilePicUrl += '&t=' + timestamp;
			}
			
			document.getElementById('profile-picture').src = profilePicUrl;
			originalProfilePicture = profilePicUrl;
			
			document.getElementById('profile-upload-button').classList.add('hidden');
			document.getElementById('profile-cancel-button').classList.add('hidden');
			
			fileInput.value = '';
		} else {
			document.getElementById('upload-status').textContent = 'Upload failed: ' + result.message;
		}
	} catch (error) {
		console.error('Upload error:', error);
		document.getElementById('upload-status').textContent = 'Upload failed: ' + error.message;
	} finally {
		document.getElementById('profile-upload-button').disabled = false;
		document.getElementById('profile-cancel-button').disabled = false;
	}
});

// Update profile form
document.getElementById('update-profile-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const data = {
		name: formData.get('name'),
		email: formData.get('email')
	};
	
	try {
		document.getElementById('profile-status').textContent = 'Updating...';
		const response = await fetch('/api/auth/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
		const result = await response.json();
		if (result.success) {
			document.getElementById('profile-status').textContent = 'Profile updated successfully!';
		} else {
			document.getElementById('profile-status').textContent = 'Update failed: ' + result.message;
		}
	} catch (error) {
		document.getElementById('profile-status').textContent = 'Update failed: ' + error.message;
	}
});

// Change password form
document.getElementById('change-password-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const data = {
		current_password: formData.get('current_password'),
		new_password: formData.get('new_password'),
		confirm_password: formData.get('confirm_password')
	};
	
	if (data.new_password !== data.confirm_password) {
		document.getElementById('password-status').textContent = 'New passwords do not match';
		return;
	}
	
	try {
		document.getElementById('password-status').textContent = 'Updating password...';
		const response = await fetch('/api/auth/password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
		const result = await response.json();
		if (result.success) {
			document.getElementById('password-status').textContent = 'Password updated successfully!';
			document.getElementById('change-password-form').reset();
		} else {
			document.getElementById('password-status').textContent = 'Update failed: ' + result.message;
		}
	} catch (error) {
		document.getElementById('password-status').textContent = 'Update failed: ' + error.message;
	}
});
  `;
}

export { renderAccountUI, renderAccountScripts };
