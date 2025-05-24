import { Env } from '../../types';
import { User } from '../auth/types';
import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderPageLayout } from '../layouts/PageLayout';

/**
 * Render the account page
 */
export async function renderAccountPage(request: Request, env: Env): Promise<Response> {
	// Check if user is authenticated
	if (!request.user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login?redirect_url=' + encodeURIComponent('/account'),
			},
		});
	}

	const user = request.user;
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'My Account - RDRX' })}
		<body class="bg-gray-50">
			${renderPageLayout({
				title: 'My Account - RDRX',
				content: renderAccountContent(user),
				activeNavItem: 'account',
			})}
			<script>
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
						
						// Log the file details for debugging
						console.log('Uploading file:', file.name, file.type, file.size);
						
						const response = await fetch('/api/auth/profile/picture', {
							method: 'POST',
							body: formData
						});
						
						// Log the response status for debugging
						console.log('Upload response status:', response.status);
						
						if (!response.ok) {
							const text = await response.text();
							console.error('Upload response text:', text);
							throw new Error('Server returned ' + response.status + ': ' + text);
						}
						
						const result = await response.json();
						if (result.success) {
							document.getElementById('upload-status').textContent = 'Upload successful!';
							// Force browser to reload the image by adding a timestamp
							const timestamp = new Date().getTime();
							
							// Get the profile picture URL from the result
							let profilePicUrl = result.user.profile_picture_url;
							
							// If the URL doesn't already have a timestamp parameter, add one
							if (profilePicUrl.indexOf('?') === -1) {
								profilePicUrl += '?t=' + timestamp;
							} else {
								profilePicUrl += '&t=' + timestamp;
							}
							
							// Update the image source and store as new original
							document.getElementById('profile-picture').src = profilePicUrl;
							originalProfilePicture = profilePicUrl;
							
							// Hide buttons after successful upload
							document.getElementById('profile-upload-button').classList.add('hidden');
							document.getElementById('profile-cancel-button').classList.add('hidden');
							
							// Clear file input
							fileInput.value = '';
							
							// Log the updated URL for debugging
							console.log('Updated profile picture URL:', profilePicUrl);
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
			</script>
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Render the account content
 */
function renderAccountContent(user: User): string {
	const profilePicture = user.profile_picture_url || 'https://via.placeholder.com/150';

	return `
        <!-- Add gradient styles to match other forms -->
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
          
          .btn-secondary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50px;
            transition: all 0.2s ease;
          }
          
          .btn-secondary:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }
          
          .btn-cancel {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 50px;
            transition: all 0.2s ease;
          }
          
          .btn-cancel:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3);
          }
          
          .success-gradient {
            background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            border: none;
            border-left: 4px solid #10b981;
          }
        </style>

        <div class="max-w-6xl mx-auto py-8 px-4">
            <!-- Welcome Section -->
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 form-card">
                <div class="flex items-center">
                    <img src="${profilePicture}" alt="Profile Picture" class="w-20 h-20 rounded-full object-cover mr-6 border-4 border-primary-100">
                    <div>
                        <h1 class="text-4xl font-bold mb-2 gradient-text">My Account</h1>
                        <p class="text-gray-500">Manage your profile and account settings</p>
                    </div>
                </div>
            </div>
            
            <!-- Account Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Profile Picture Section -->
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">Profile Picture</h2>
                    <div class="flex flex-col items-center">
                        <img id="profile-picture" src="${profilePicture}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mb-6 border-4 border-primary-100">
                        <form id="profile-picture-form" class="flex flex-col items-center w-full space-y-4">
                            <label class="btn-secondary text-white font-medium py-3 px-6 rounded-full cursor-pointer transition duration-300 text-center w-full">
                                Choose Photo
                                <input id="profile-picture-upload" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" class="hidden">
                            </label>
                            <button id="profile-upload-button" type="submit" class="btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300 w-full hidden">
                                Save Photo
                            </button>
                            <button id="profile-cancel-button" type="button" class="btn-cancel text-white font-medium py-3 px-6 rounded-full focus:outline-none transition duration-300 w-full hidden">
                                Cancel
                            </button>
                        </form>
                        <p id="upload-status" class="mt-4 text-sm text-gray-600 text-center"></p>
                    </div>
                </div>
                
                <!-- Profile Information Section -->
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card lg:col-span-2">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
                    <form id="update-profile-form" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1" for="name">
                                Name
                            </label>
                            <input class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition" 
                                id="name" name="name" type="text" value="${user.name}" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
                                Email
                            </label>
                            <input class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition" 
                                id="email" name="email" type="email" value="${user.email}" required>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <button class="btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300" 
                                type="submit">
                                Update Profile
                            </button>
                            <p id="profile-status" class="text-sm text-gray-600"></p>
                        </div>
                    </form>
                </div>
                
                <!-- Change Password Section -->
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card lg:col-span-3">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>
                    <form id="change-password-form" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="current_password">
                                    Current Password
                                </label>
                                <input class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition" 
                                    id="current_password" name="current_password" type="password" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="new_password">
                                    New Password
                                </label>
                                <input class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition" 
                                    id="new_password" name="new_password" type="password" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="confirm_password">
                                    Confirm New Password
                                </label>
                                <input class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition" 
                                    id="confirm_password" name="confirm_password" type="password" required>
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <button class="btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300" 
                                type="submit">
                                Change Password
                            </button>
                            <p id="password-status" class="text-sm text-gray-600"></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
