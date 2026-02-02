import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, emailVerificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);
	const derivedBits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
		keyMaterial,
		256
	);
	const hashArray = new Uint8Array(derivedBits);
	const saltHex = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
	const hashHex = Array.from(hashArray, b => b.toString(16).padStart(2, '0')).join('');
	return `${saltHex}:${hashHex}`;
}

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return {
			valid: false,
			error: 'No invitation token provided'
		};
	}

	const tokenRecord = await db
		.select()
		.from(emailVerificationTokens)
		.where(eq(emailVerificationTokens.token, token))
		.get();

	if (!tokenRecord) {
		return {
			valid: false,
			error: 'Invalid or expired invitation link'
		};
	}

	if (tokenRecord.expiresAt < new Date()) {
		// Clean up expired token
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id));
		return {
			valid: false,
			error: 'This invitation link has expired. Please contact an administrator.'
		};
	}

	const user = await db.select().from(users).where(eq(users.id, tokenRecord.userId)).get();

	if (!user) {
		return {
			valid: false,
			error: 'User not found'
		};
	}

	// Check if user already has a password set (already activated)
	if (user.passwordHash && user.passwordHash.length > 0) {
		return {
			valid: false,
			error: 'This account has already been activated. Please log in.'
		};
	}

	return {
		valid: true,
		token,
		userName: user.name
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

		if (!password || password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		const tokenRecord = await db
			.select()
			.from(emailVerificationTokens)
			.where(eq(emailVerificationTokens.token, token))
			.get();

		if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
			return fail(400, { error: 'Invalid or expired invitation link' });
		}

		// Hash the password
		const passwordHash = await hashPassword(password);

		// Update user with password and mark as verified
		await db
			.update(users)
			.set({
				passwordHash,
				emailVerified: true
			})
			.where(eq(users.id, tokenRecord.userId));

		// Delete the token
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id));

		// Redirect to login with success message
		redirect(302, '/login?setup=success');
	}
};
