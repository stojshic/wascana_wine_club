import { Resend } from 'resend';
import { RESEND_API_KEY, APP_URL } from '$env/static/private';

const FROM_EMAIL = 'Wascana Wine Club <noreply@notifications.wascanawineclub.com>';

function getResendClient() {
	if (!RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY is not configured');
	}
	return new Resend(RESEND_API_KEY);
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
	const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

	await getResendClient().emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: 'Verify your email - Wascana Wine Club',
		html: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #c4a142;">Welcome to Wascana Wine Club!</h1>
				<p>Hi ${name},</p>
				<p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
				<div style="margin: 30px 0;">
					<a href="${verifyUrl}" style="background-color: #c4a142; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
						Verify Email
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p style="color: #666; word-break: break-all;">${verifyUrl}</p>
				<p>This link will expire in 24 hours.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
				<p style="color: #999; font-size: 12px;">
					If you didn't create an account, you can safely ignore this email.
				</p>
			</div>
		`
	});
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
	const resetUrl = `${APP_URL}/reset-password?token=${token}`;

	await getResendClient().emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: 'Reset your password - Wascana Wine Club',
		html: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #c4a142;">Password Reset Request</h1>
				<p>Hi ${name},</p>
				<p>We received a request to reset your password. Click the button below to create a new password:</p>
				<div style="margin: 30px 0;">
					<a href="${resetUrl}" style="background-color: #c4a142; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
						Reset Password
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p style="color: #666; word-break: break-all;">${resetUrl}</p>
				<p>This link will expire in 1 hour.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
				<p style="color: #999; font-size: 12px;">
					If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
				</p>
			</div>
		`
	});
}

export async function sendAccountLockedEmail(email: string, name: string) {
	await getResendClient().emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: 'Account temporarily locked - Wascana Wine Club',
		html: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #dc2626;">Account Temporarily Locked</h1>
				<p>Hi ${name},</p>
				<p>We detected multiple failed login attempts on your account. For your security, we've temporarily locked your account for 15 minutes.</p>
				<p>If this wasn't you, we recommend changing your password once the lockout period ends.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
				<p style="color: #999; font-size: 12px;">
					If you need immediate assistance, please contact support.
				</p>
			</div>
		`
	});
}
