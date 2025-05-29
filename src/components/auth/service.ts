import { Env } from '../../types';
import { SignupRequest, LoginRequest, ResetPasswordRequest, ResetPasswordConfirmRequest, AuthResponse, User } from './types';
import {
	createUser,
	getUserByEmail,
	getUserByUid,
	setPasswordResetToken,
	getUserByResetToken,
	updateUserPassword,
	updateUserProfilePicture,
} from './database';
import {
	generateUID,
	generateResetToken,
	hashPassword,
	verifyPassword,
	isValidEmail,
	isValidPassword,
	createSessionData,
	createSessionToken,
	verifySessionToken,
	extractSessionToken,
	isValidProfilePictureType,
	generateProfilePicturePath,
} from './utils';
import { sendWelcomeEmail, sendPasswordResetEmail } from './email';

/**
 * Sign up a new user
 */
export async function signupUser(env: Env, request: SignupRequest): Promise<AuthResponse> {
	try {
		console.log('Signup attempt for email:', request.email);

		// Validate input
		if (!request.name || !request.email || !request.password) {
			console.log('Signup failed: Missing required fields');
			return {
				success: false,
				message: 'Name, email, and password are required',
			};
		}

		if (!isValidEmail(request.email)) {
			console.log('Signup failed: Invalid email format');
			return {
				success: false,
				message: 'Invalid email format',
			};
		}

		const passwordValidation = isValidPassword(request.password);
		if (!passwordValidation.valid) {
			console.log('Signup failed: Invalid password');
			return {
				success: false,
				message: passwordValidation.message || 'Invalid password',
			};
		}

		// Check if user already exists
		const existingUser = await getUserByEmail(env, request.email);
		if (existingUser) {
			console.log('Signup failed: User already exists');
			return {
				success: false,
				message: 'User with this email already exists',
			};
		}

		// Create new user
		const uid = generateUID();
		console.log('Generated UID:', uid);

		const passwordHash = await hashPassword(request.password);
		console.log('Password hashed successfully');

		const newUser: Omit<User, 'created_at' | 'updated_at'> = {
			uid,
			name: request.name,
			email: request.email,
			password_hash: passwordHash,
			email_verified: false,
		};

		const user = await createUser(env, newUser);
		console.log('User created in database:', user.uid);

		// Send welcome email
		try {
			const emailSent = await sendWelcomeEmail(env, user.email, user.name);
			console.log('Welcome email sent:', emailSent);
		} catch (error) {
			console.error('Failed to send welcome email:', error);
			// Don't fail the signup if email fails
		}

		// Create session token
		if (!env.JWT_SECRET) {
			console.error('JWT_SECRET not configured');
			return {
				success: false,
				message: 'Server configuration error',
			};
		}

		const sessionData = createSessionData(user.uid, user.email, user.name);
		const token = await createSessionToken(sessionData, env.JWT_SECRET);
		console.log('Session token created successfully');

		return {
			success: true,
			message: 'User created successfully',
			user: {
				uid: user.uid,
				name: user.name,
				email: user.email,
				profile_picture_url: user.profile_picture_url,
				created_at: user.created_at,
				updated_at: user.updated_at,
				email_verified: user.email_verified,
			},
			token,
		};
	} catch (error) {
		console.error('Error signing up user:', error);
		return {
			success: false,
			message: 'Internal server error during signup',
		};
	}
}

/**
 * Log in a user
 */
export async function loginUser(env: Env, request: LoginRequest): Promise<AuthResponse> {
	try {
		console.log('Login attempt for email:', request.email);

		// Validate input
		if (!request.email || !request.password) {
			console.log('Login failed: Missing email or password');
			return {
				success: false,
				message: 'Email and password are required',
			};
		}

		// Get user by email
		const user = await getUserByEmail(env, request.email);
		if (!user) {
			console.log('Login failed: User not found');
			return {
				success: false,
				message: 'Invalid email or password',
			};
		}

		console.log('User found, verifying password');

		// Verify password
		const isValidPassword = await verifyPassword(request.password, user.password_hash);
		if (!isValidPassword) {
			console.log('Login failed: Invalid password');
			return {
				success: false,
				message: 'Invalid email or password',
			};
		}

		console.log('Password verified successfully');

		// Check JWT secret
		if (!env.JWT_SECRET) {
			console.error('JWT_SECRET not configured');
			return {
				success: false,
				message: 'Server configuration error',
			};
		}

		// Create session token
		const sessionData = createSessionData(user.uid, user.email, user.name);
		const token = await createSessionToken(sessionData, env.JWT_SECRET);
		console.log('Login successful, token created');

		return {
			success: true,
			message: 'Login successful',
			user: {
				uid: user.uid,
				name: user.name,
				email: user.email,
				profile_picture_url: user.profile_picture_url,
				created_at: user.created_at,
				updated_at: user.updated_at,
				email_verified: user.email_verified,
			},
			token,
		};
	} catch (error) {
		console.error('Error logging in user:', error);
		return {
			success: false,
			message: 'Internal server error during login',
		};
	}
}

/**
 * Request password reset
 */
export async function requestPasswordReset(env: Env, request: ResetPasswordRequest): Promise<AuthResponse> {
	try {
		console.log('Password reset request for email:', request.email);

		// Validate input
		if (!request.email) {
			return {
				success: false,
				message: 'Email is required',
			};
		}

		if (!isValidEmail(request.email)) {
			return {
				success: false,
				message: 'Invalid email format',
			};
		}

		// Get user by email
		const user = await getUserByEmail(env, request.email);
		if (!user) {
			console.log('Password reset: User not found, but returning success for security');
			// Don't reveal if user exists or not for security
			return {
				success: true,
				message: 'If an account with this email exists, a password reset link has been sent',
			};
		}

		// Generate reset token
		const resetToken = generateResetToken();
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

		console.log('Generated reset token for user:', user.uid);

		// Save reset token
		await setPasswordResetToken(env, user.email, resetToken, expiresAt);

		// Send reset email
		try {
			const emailSent = await sendPasswordResetEmail(env, user.email, user.name, resetToken);
			console.log('Password reset email sent:', emailSent);

			if (!emailSent) {
				console.error('Failed to send password reset email');
				return {
					success: false,
					message: 'Failed to send password reset email. Please check your email configuration.',
				};
			}
		} catch (error) {
			console.error('Failed to send password reset email:', error);
			return {
				success: false,
				message: 'Failed to send password reset email',
			};
		}

		return {
			success: true,
			message: 'If an account with this email exists, a password reset link has been sent',
		};
	} catch (error) {
		console.error('Error requesting password reset:', error);
		return {
			success: false,
			message: 'Internal server error during password reset request',
		};
	}
}

/**
 * Confirm password reset
 */
export async function confirmPasswordReset(env: Env, request: ResetPasswordConfirmRequest): Promise<AuthResponse> {
	try {
		console.log('Password reset confirmation attempt');

		// Validate input
		if (!request.token || !request.new_password) {
			return {
				success: false,
				message: 'Token and new password are required',
			};
		}

		const passwordValidation = isValidPassword(request.new_password);
		if (!passwordValidation.valid) {
			return {
				success: false,
				message: passwordValidation.message || 'Invalid password',
			};
		}

		// Get user by reset token
		const user = await getUserByResetToken(env, request.token);
		if (!user) {
			console.log('Password reset failed: Invalid or expired token');
			return {
				success: false,
				message: 'Invalid or expired reset token',
			};
		}

		console.log('Valid reset token found for user:', user.uid);

		// Hash new password
		const passwordHash = await hashPassword(request.new_password);

		// Update password and clear reset token
		await updateUserPassword(env, user.uid, passwordHash);
		console.log('Password updated successfully');

		return {
			success: true,
			message: 'Password reset successfully',
		};
	} catch (error) {
		console.error('Error confirming password reset:', error);
		return {
			success: false,
			message: 'Internal server error during password reset',
		};
	}
}

/**
 * Verify session token and get user
 */
export async function verifySession(env: Env, request: Request): Promise<{ user: User | null; session: any | null }> {
	try {
		const token = extractSessionToken(request);
		if (!token) {
			console.log('No session token found');
			return { user: null, session: null };
		}

		if (!env.JWT_SECRET) {
			console.error('JWT_SECRET not configured');
			return { user: null, session: null };
		}

		const sessionData = await verifySessionToken(token, env.JWT_SECRET);
		if (!sessionData) {
			console.log('Invalid session token');
			return { user: null, session: null };
		}

		const user = await getUserByUid(env, sessionData.uid);
		if (!user) {
			console.log('User not found for session');
			return { user: null, session: null };
		}

		console.log('Session verified for user:', user.uid);
		return { user, session: sessionData };
	} catch (error) {
		console.error('Error verifying session:', error);
		return { user: null, session: null };
	}
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(env: Env, uid: string, file: File): Promise<AuthResponse> {
	try {
		console.log('Profile picture upload for user:', uid);
		console.log('File details:', file.name, file.type, file.size);

		// Validate file type
		if (!isValidProfilePictureType(file.name)) {
			console.log('Invalid file type:', file.name, file.type);
			return {
				success: false,
				message: 'Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed',
			};
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			console.log('File too large:', file.size);
			return {
				success: false,
				message: 'File size too large. Maximum 5MB allowed',
			};
		}

		// Generate file path
		const filePath = generateProfilePicturePath(uid, file.name);
		console.log('Generated file path:', filePath);

		try {
			// Check if R2 bucket is available
			if (!env.R2_RDRX) {
				console.error('R2_RDRX bucket not available');
				return {
					success: false,
					message: 'Storage service unavailable',
				};
			}

			// Get file data as ArrayBuffer
			const arrayBuffer = await file.arrayBuffer();

			// Upload to R2
			await env.R2_RDRX.put(filePath, arrayBuffer, {
				httpMetadata: {
					contentType: file.type,
				},
			});

			console.log('File uploaded to R2:', filePath);
			// Update user profile picture URL
			// Use a direct URL to the bucket with a timestamp to prevent caching
			const timestamp = Date.now();
			const profilePictureUrl = `${env.R2_URL}/${filePath}?t=${timestamp}`;
			await updateUserProfilePicture(env, uid, profilePictureUrl);

			// Get updated user
			const user = await getUserByUid(env, uid);
			if (!user) {
				console.log('User not found after upload');
				return {
					success: false,
					message: 'User not found',
				};
			}

			console.log('Profile picture updated successfully');

			return {
				success: true,
				message: 'Profile picture uploaded successfully',
				user: {
					uid: user.uid,
					name: user.name,
					email: user.email,
					profile_picture_url: user.profile_picture_url,
					created_at: user.created_at,
					updated_at: user.updated_at,
					email_verified: user.email_verified,
				},
			};
		} catch (uploadError) {
			console.error('Error during R2 upload:', uploadError);
			return {
				success: false,
				message: 'Error uploading file: ' + (uploadError instanceof Error ? uploadError.message : String(uploadError)),
			};
		}
	} catch (error) {
		console.error('Error uploading profile picture:', error);
		return {
			success: false,
			message: 'Internal server error during file upload: ' + (error instanceof Error ? error.message : String(error)),
		};
	}
}
