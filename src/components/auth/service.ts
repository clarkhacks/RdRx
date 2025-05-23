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
		// Validate input
		if (!request.name || !request.email || !request.password) {
			return {
				success: false,
				message: 'Name, email, and password are required',
			};
		}

		if (!isValidEmail(request.email)) {
			return {
				success: false,
				message: 'Invalid email format',
			};
		}

		const passwordValidation = isValidPassword(request.password);
		if (!passwordValidation.valid) {
			return {
				success: false,
				message: passwordValidation.message || 'Invalid password',
			};
		}

		// Check if user already exists
		const existingUser = await getUserByEmail(env, request.email);
		if (existingUser) {
			return {
				success: false,
				message: 'User with this email already exists',
			};
		}

		// Create new user
		const uid = generateUID();
		const passwordHash = await hashPassword(request.password);

		const newUser: Omit<User, 'created_at' | 'updated_at'> = {
			uid,
			name: request.name,
			email: request.email,
			password_hash: passwordHash,
			email_verified: false,
		};

		const user = await createUser(env, newUser);

		// Send welcome email
		try {
			await sendWelcomeEmail(env, user.email, user.name);
		} catch (error) {
			console.error('Failed to send welcome email:', error);
			// Don't fail the signup if email fails
		}

		// Create session token
		const sessionData = createSessionData(user.uid, user.email, user.name);
		const token = await createSessionToken(sessionData, env.JWT_SECRET);

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
			message: 'Internal server error',
		};
	}
}

/**
 * Log in a user
 */
export async function loginUser(env: Env, request: LoginRequest): Promise<AuthResponse> {
	try {
		// Validate input
		if (!request.email || !request.password) {
			return {
				success: false,
				message: 'Email and password are required',
			};
		}

		// Get user by email
		const user = await getUserByEmail(env, request.email);
		if (!user) {
			return {
				success: false,
				message: 'Invalid email or password',
			};
		}

		// Verify password
		const isValidPassword = await verifyPassword(request.password, user.password_hash);
		if (!isValidPassword) {
			return {
				success: false,
				message: 'Invalid email or password',
			};
		}

		// Create session token
		const sessionData = createSessionData(user.uid, user.email, user.name);
		const token = await createSessionToken(sessionData, env.JWT_SECRET);

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
			message: 'Internal server error',
		};
	}
}

/**
 * Request password reset
 */
export async function requestPasswordReset(env: Env, request: ResetPasswordRequest): Promise<AuthResponse> {
	try {
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
			// Don't reveal if user exists or not for security
			return {
				success: true,
				message: 'If an account with this email exists, a password reset link has been sent',
			};
		}

		// Generate reset token
		const resetToken = generateResetToken();
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

		// Save reset token
		await setPasswordResetToken(env, user.email, resetToken, expiresAt);

		// Send reset email
		try {
			await sendPasswordResetEmail(env, user.email, user.name, resetToken);
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
			message: 'Internal server error',
		};
	}
}

/**
 * Confirm password reset
 */
export async function confirmPasswordReset(env: Env, request: ResetPasswordConfirmRequest): Promise<AuthResponse> {
	try {
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
			return {
				success: false,
				message: 'Invalid or expired reset token',
			};
		}

		// Hash new password
		const passwordHash = await hashPassword(request.new_password);

		// Update password and clear reset token
		await updateUserPassword(env, user.uid, passwordHash);

		return {
			success: true,
			message: 'Password reset successfully',
		};
	} catch (error) {
		console.error('Error confirming password reset:', error);
		return {
			success: false,
			message: 'Internal server error',
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
			return { user: null, session: null };
		}

		const sessionData = await verifySessionToken(token, env.JWT_SECRET);
		if (!sessionData) {
			return { user: null, session: null };
		}

		const user = await getUserByUid(env, sessionData.uid);
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
		// Validate file type
		if (!isValidProfilePictureType(file.name)) {
			return {
				success: false,
				message: 'Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed',
			};
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return {
				success: false,
				message: 'File size too large. Maximum 5MB allowed',
			};
		}

		// Generate file path
		const filePath = generateProfilePicturePath(uid, file.name);

		// Upload to R2
		await env.R2_RDRX.put(filePath, file.stream(), {
			httpMetadata: {
				contentType: file.type,
			},
		});

		// Update user profile picture URL
		const profilePictureUrl = `https://r2.rdrx.app/${filePath}`;
		await updateUserProfilePicture(env, uid, profilePictureUrl);

		// Get updated user
		const user = await getUserByUid(env, uid);
		if (!user) {
			return {
				success: false,
				message: 'User not found',
			};
		}

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
	} catch (error) {
		console.error('Error uploading profile picture:', error);
		return {
			success: false,
			message: 'Internal server error',
		};
	}
}
