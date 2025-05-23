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
				// Profile picture upload
				document.getElementById('profile-picture-upload').addEventListener('change', async (e) => {
					const file = e.target.files[0];
					if (!file) return;
					
					const formData = new FormData();
					formData.append('file', file);
					
					try {
						document.getElementById('upload-status').textContent = 'Uploading...';
						
						// Log the file details for debugging
						console.log('Uploading file:', file.name, file.type, file.size);
						
						const response = await fetch('/api/auth/profile/picture', {
							method: 'POST',
							body: formData
						});
						
						// Log the response status for debugging
						console.log('Upload response status:', response.status);
						
						const result = await response.json();
						if (result.success) {
							document.getElementById('upload-status').textContent = 'Upload successful!';
							document.getElementById('profile-picture').src = result.user.profile_picture_url + '?t=' + new Date().getTime();
						} else {
							document.getElementById('upload-status').textContent = 'Upload failed: ' + result.message;
						}
					} catch (error) {
						document.getElementById('upload-status').textContent = 'Upload failed: ' + error.message;
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
		<div class="max-w-4xl mx-auto py-8 px-4">
			<h1 class="text-3xl font-bold mb-8">My Account</h1>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<!-- Profile Picture Section -->
				<div class="bg-white p-6 rounded-lg shadow-md">
					<h2 class="text-xl font-semibold mb-4">Profile Picture</h2>
					<div class="flex flex-col items-center">
						<img id="profile-picture" src="${profilePicture}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mb-4">
						<label class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">
							Upload New Picture
							<input id="profile-picture-upload" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" class="hidden">
						</label>
						<p id="upload-status" class="mt-2 text-sm text-gray-600"></p>
					</div>
				</div>
				
				<!-- Profile Information Section -->
				<div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
					<h2 class="text-xl font-semibold mb-4">Profile Information</h2>
					<form id="update-profile-form">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="name">
								Name
							</label>
							<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
								id="name" name="name" type="text" value="${user.name}" required>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="email">
								Email
							</label>
							<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
								id="email" name="email" type="email" value="${user.email}" required>
						</div>
						<div class="flex items-center justify-between">
							<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
								type="submit">
								Update Profile
							</button>
							<p id="profile-status" class="text-sm text-gray-600"></p>
						</div>
					</form>
				</div>
				
				<!-- Change Password Section -->
				<div class="bg-white p-6 rounded-lg shadow-md md:col-span-3">
					<h2 class="text-xl font-semibold mb-4">Change Password</h2>
					<form id="change-password-form">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="current_password">
								Current Password
							</label>
							<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
								id="current_password" name="current_password" type="password" required>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="new_password">
								New Password
							</label>
							<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
								id="new_password" name="new_password" type="password" required>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="confirm_password">
								Confirm New Password
							</label>
							<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
								id="confirm_password" name="confirm_password" type="password" required>
						</div>
						<div class="flex items-center justify-between">
							<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
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
