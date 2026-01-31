import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth/password';
import { verifyPasswordResetToken, consumePasswordResetToken, invalidateAllUserSessions } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	// If already logged in, redirect to home
	if (locals.user) {
		redirect(302, '/');
	}

	const token = url.searchParams.get('token');

	if (!token) {
		return {
			valid: false,
			error: 'No reset token provided'
		};
	}

	const result = await verifyPasswordResetToken(token);

	if (!result.valid) {
		return {
			valid: false,
			error: 'Invalid or expired reset link. Please request a new one.'
		};
	}

	return {
		valid: true,
		token
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token')?.toString();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!token) {
			return fail(400, { error: 'Invalid request' });
		}

		if (!password || !confirmPassword) {
			return fail(400, { error: 'All fields are required' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		const tokenResult = await verifyPasswordResetToken(token);

		if (!tokenResult.valid || !tokenResult.userId) {
			return fail(400, { error: 'Invalid or expired reset link' });
		}

		// Hash new password
		const passwordHash = await hashPassword(password);

		// Update user's password
		await db
			.update(users)
			.set({ passwordHash })
			.where(eq(users.id, tokenResult.userId));

		// Invalidate all existing sessions for security
		await invalidateAllUserSessions(tokenResult.userId);

		// Consume the reset token
		await consumePasswordResetToken(token);

		redirect(302, '/login?reset=success');
	}
};
