import { Env } from '../../types';

/**
 * Get email configuration
 */
export async function handleGetEmailConfig(request: Request, env: Env): Promise<Response> {
	try {
		return new Response(
			JSON.stringify({
				success: true,
				fromEmail: env.FROM_EMAIL || 'noreply@rdrx.co',
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.error('Error getting email config:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Handle test email sending
 */
export async function handleTestEmail(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const emailType = path.split('/')[1];
		const body = (await request.json()) as any;

		// Import email functions
		const { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerificationEmail } = await import('../../components/auth/email');

		let success = false;

		switch (emailType) {
			case 'welcome':
				success = await sendWelcomeEmail(env, body.email, body.name);
				break;
			case 'reset':
				// Generate a test token
				const testResetToken = 'test-reset-token-' + crypto.randomUUID();
				success = await sendPasswordResetEmail(env, body.email, body.name, testResetToken);
				break;
			case 'verification':
				// Generate a test token
				const testVerificationToken = 'test-verification-token-' + crypto.randomUUID();
				success = await sendEmailVerificationEmail(env, body.email, body.name, testVerificationToken);
				break;
			case 'custom':
				success = await sendEmail(env, {
					to: body.email,
					subject: body.subject,
					html: `<p>${body.message}</p>`,
					text: body.message,
				});
				break;
			default:
				return new Response(JSON.stringify({ success: false, message: 'Invalid email type' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
		}

		return new Response(
			JSON.stringify({
				success,
				message: success ? 'Email sent successfully' : 'Failed to send email',
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.error('Error sending test email:', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Error sending email: ' + (error instanceof Error ? error.message : 'Unknown error'),
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}
}
