import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createEmailVerificationToken } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	// If already verified, redirect to home
	if (locals.user.emailVerified) {
		redirect(302, '/');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	resend: async ({ locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		if (locals.user.emailVerified) {
			return fail(400, { error: 'Email already verified' });
		}

		const user = await db.select().from(users).where(eq(users.id, locals.user.id)).get();
		if (!user) {
			return fail(404, { error: 'User not found' });
		}

		try {
			const token = await createEmailVerificationToken(user.id);
			await sendVerificationEmail(user.email, user.name, token);
			return { success: true };
		} catch (error) {
			console.error('Failed to send verification email:', error);
			return fail(500, { error: 'Failed to send verification email' });
		}
	}
};
