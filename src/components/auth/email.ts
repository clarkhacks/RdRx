import { Env } from '../../types';

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

/**
 * Send email using Mailgun API
 */
export async function sendEmail(env: Env, options: EmailOptions): Promise<boolean> {
	try {
		const mailgunDomain = env.MAILGUN_DOMAIN;
		const mailgunApiKey = env.MAILGUN_API_KEY;
		const fromEmail = env.FROM_EMAIL || `noreply@${mailgunDomain}`;

		if (!mailgunDomain || !mailgunApiKey) {
			console.error('Mailgun configuration missing');
			return false;
		}

		const formData = new FormData();
		formData.append('from', fromEmail);
		formData.append('to', options.to);
		formData.append('subject', options.subject);
		formData.append('html', options.html);
		if (options.text) {
			formData.append('text', options.text);
		}

		const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
			},
			body: formData,
		});

		if (response.ok) {
			console.log(`Email sent successfully to ${options.to}`);
			return true;
		} else {
			const errorText = await response.text();
			console.error('Failed to send email:', errorText);
			return false;
		}
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(env: Env, userEmail: string, userName: string): Promise<boolean> {
	const subject = 'Welcome to RDRX!';
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to RDRX</title>
		</head>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
				<h1 style="color: white; margin: 0; font-size: 28px;">Welcome to RDRX!</h1>
			</div>
			<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
				<h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
				<p>Thank you for joining RDRX, your go-to platform for URL shortening and file sharing.</p>
				<p>You can now:</p>
				<ul>
					<li>Create short URLs for easy sharing</li>
					<li>Upload and share files securely</li>
					<li>Track analytics on your links</li>
					<li>Manage your content with ease</li>
				</ul>
				<p>Get started by logging into your account and exploring all the features we have to offer.</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${
						env.FRONTEND_URL || 'https://rdrx.app'
					}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
				</div>
				<p style="color: #666; font-size: 14px;">If you have any questions, feel free to reach out to our support team.</p>
			</div>
		</body>
		</html>
	`;

	const text = `
		Welcome to RDRX!
		
		Hi ${userName}!
		
		Thank you for joining RDRX, your go-to platform for URL shortening and file sharing.
		
		You can now:
		- Create short URLs for easy sharing
		- Upload and share files securely
		- Track analytics on your links
		- Manage your content with ease
		
		Get started by logging into your account and exploring all the features we have to offer.
		
		Visit: ${env.FRONTEND_URL || 'https://rdrx.app'}
		
		If you have any questions, feel free to reach out to our support team.
	`;

	return await sendEmail(env, {
		to: userEmail,
		subject,
		html,
		text,
	});
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(env: Env, userEmail: string, userName: string, resetToken: string): Promise<boolean> {
	const resetUrl = `${env.FRONTEND_URL || 'https://rdrx.app'}/reset-password?token=${resetToken}`;
	const subject = 'Reset Your RDRX Password';

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Reset Your Password</title>
		</head>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
				<h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
			</div>
			<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
				<h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
				<p>We received a request to reset your password for your RDRX account.</p>
				<p>Click the button below to reset your password:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${resetUrl}" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
				</div>
				<p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
				<p style="color: #666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
				<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
				<p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
				<p style="color: #999; font-size: 12px; word-break: break-all;">${resetUrl}</p>
			</div>
		</body>
		</html>
	`;

	const text = `
		Password Reset - RDRX
		
		Hi ${userName}!
		
		We received a request to reset your password for your RDRX account.
		
		Click the link below to reset your password:
		${resetUrl}
		
		If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
		
		This link will expire in 1 hour for security reasons.
	`;

	return await sendEmail(env, {
		to: userEmail,
		subject,
		html,
		text,
	});
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(
	env: Env,
	userEmail: string,
	userName: string,
	verificationToken: string,
): Promise<boolean> {
	const verificationUrl = `${env.FRONTEND_URL || 'https://rdrx.app'}/verify-email?token=${verificationToken}`;
	const subject = 'Verify Your RDRX Email Address';

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Verify Your Email</title>
		</head>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
				<h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
			</div>
			<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
				<h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
				<p>Thank you for signing up for RDRX! To complete your registration, please verify your email address.</p>
				<p>Click the button below to verify your email:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${verificationUrl}" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
				</div>
				<p style="color: #666; font-size: 14px;">If you didn't create an account with RDRX, you can safely ignore this email.</p>
				<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
				<p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
				<p style="color: #999; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
			</div>
		</body>
		</html>
	`;

	const text = `
		Verify Your Email - RDRX
		
		Hi ${userName}!
		
		Thank you for signing up for RDRX! To complete your registration, please verify your email address.
		
		Click the link below to verify your email:
		${verificationUrl}
		
		If you didn't create an account with RDRX, you can safely ignore this email.
	`;

	return await sendEmail(env, {
		to: userEmail,
		subject,
		html,
		text,
	});
}
