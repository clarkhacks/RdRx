/**
 * Custom authentication types
 */

export interface User {
	uid: string;
	name: string;
	email: string;
	password_hash: string;
	profile_picture_url?: string;
	created_at: string;
	updated_at: string;
	email_verified: boolean;
	reset_token?: string;
	reset_token_expires?: string;
}

export interface SignupRequest {
	name: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface ResetPasswordRequest {
	email: string;
}

export interface ResetPasswordConfirmRequest {
	token: string;
	new_password: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	user?: Omit<User, 'password_hash' | 'reset_token'>;
	token?: string;
}

export interface ProfilePictureUploadRequest {
	uid: string;
	file: File;
}

export interface SessionData {
	uid: string;
	email: string;
	name: string;
	created_at: number;
	expires_at: number;
}
