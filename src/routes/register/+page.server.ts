import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth/password';
import { createSession, setSessionCookie, createEmailVerificationToken } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!name || !email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required', name, email });
		}

		if (name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters', name, email });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Invalid email address', name, email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', name, email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', name, email });
		}

		const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
		if (existingUser) {
			return fail(400, { error: 'Email already registered', name, email });
		}

		const passwordHash = await hashPassword(password);

		const result = await db
			.insert(users)
			.values({
				name,
				email,
				passwordHash,
				emailVerified: false
			})
			.returning({ id: users.id })
			.get();

		// Create verification token and send email
		try {
			const token = await createEmailVerificationToken(result.id);
			await sendVerificationEmail(email, name, token);
		} catch (error) {
			console.error('Failed to send verification email:', error);
			// Continue anyway - user can request new verification email
		}

		const sessionId = await createSession(result.id);
		setSessionCookie(event, sessionId);

		redirect(302, '/verify-email-sent');
	}
};
