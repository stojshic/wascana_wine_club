import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, emailVerificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendInviteEmail } from '$lib/server/email';
import type { Actions } from './$types';

function generateToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const role = formData.get('role')?.toString() as 'customer' | 'admin';

		if (!name || !email) {
			return fail(400, {
				error: 'Name and email are required',
				name,
				email,
				role
			});
		}

		if (!role || !['customer', 'admin'].includes(role)) {
			return fail(400, {
				error: 'Invalid role',
				name,
				email,
				role
			});
		}

		// Check if user already exists
		const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

		if (existingUser) {
			return fail(400, {
				error: 'A user with this email already exists',
				name,
				email,
				role
			});
		}

		// Create user without password (they'll set it when accepting invite)
		const [newUser] = await db.insert(users).values({
			name,
			email,
			passwordHash: '', // Empty - will be set when user accepts invite
			role,
			emailVerified: false
		}).returning();

		// Create invite token (using email verification tokens table)
		const token = generateToken();
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		await db.insert(emailVerificationTokens).values({
			userId: newUser.id,
			token,
			expiresAt
		});

		// Send invite email
		try {
			await sendInviteEmail(email, name, token);
		} catch (error) {
			console.error('Failed to send invite email:', error);
			// Delete the user if email fails
			await db.delete(users).where(eq(users.id, newUser.id));
			return fail(500, {
				error: 'Failed to send invitation email. Please try again.',
				name,
				email,
				role
			});
		}

		return {
			success: true,
			email
		};
	}
};
