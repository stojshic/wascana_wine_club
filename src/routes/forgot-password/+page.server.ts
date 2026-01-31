import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createPasswordResetToken } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase();

		if (!email) {
			return fail(400, { error: 'Email is required' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Invalid email address' });
		}

		const user = await db.select().from(users).where(eq(users.email, email)).get();

		// Always return success to prevent email enumeration
		if (!user) {
			return { success: true };
		}

		try {
			const token = await createPasswordResetToken(user.id);
			await sendPasswordResetEmail(user.email, user.name, token);
		} catch (error) {
			console.error('Failed to send password reset email:', error);
			// Still return success to prevent enumeration
		}

		return { success: true };
	}
};
