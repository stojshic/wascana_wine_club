import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession, setSessionCookie, checkLoginAttempts, recordFailedLogin, clearLoginAttempts } from '$lib/server/auth';
import { sendAccountLockedEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, locals.user.role === 'admin' ? '/admin' : '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		// Check if account is locked
		const attemptCheck = await checkLoginAttempts(email);
		if (!attemptCheck.allowed) {
			const minutes = attemptCheck.lockedUntil
				? Math.ceil((attemptCheck.lockedUntil.getTime() - Date.now()) / 60000)
				: 15;
			return fail(429, {
				error: `Too many login attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
				email
			});
		}

		const user = await db.select().from(users).where(eq(users.email, email)).get();

		if (!user) {
			// Record failed attempt even for non-existent users to prevent enumeration
			await recordFailedLogin(email);
			return fail(400, { error: 'Invalid email or password', email });
		}

		const validPassword = await verifyPassword(password, user.passwordHash);

		if (!validPassword) {
			const lockResult = await recordFailedLogin(email);

			if (lockResult.locked) {
				// Send notification email about account being locked
				try {
					await sendAccountLockedEmail(user.email, user.name);
				} catch (error) {
					console.error('Failed to send account locked email:', error);
				}

				return fail(429, {
					error: 'Too many login attempts. Your account has been temporarily locked for 15 minutes.',
					email
				});
			}

			const remaining = 5 - (attemptCheck.remainingAttempts ?? 5) - 1;
			const attemptsLeft = Math.max(0, 5 - remaining - 1);

			return fail(400, {
				error: `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
				email
			});
		}

		// Clear login attempts on successful login
		await clearLoginAttempts(email);

		const sessionId = await createSession(user.id);
		setSessionCookie(event, sessionId);

		redirect(302, user.role === 'admin' ? '/admin' : '/');
	}
};
