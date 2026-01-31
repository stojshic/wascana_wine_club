import { db } from '$lib/server/db';
import { sessions, users, emailVerificationTokens, passwordResetTokens, loginAttempts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRY_DAYS = 30;

export function generateSessionId(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: number): Promise<string> {
	const sessionId = generateSessionId();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	await db.insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt
	});

	return sessionId;
}

export async function validateSession(sessionId: string) {
	const result = await db
		.select({
			session: sessions,
			user: users
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.get();

	if (!result) {
		return { session: null, user: null };
	}

	if (result.session.expiresAt < new Date()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return { session: null, user: null };
	}

	return {
		session: result.session,
		user: {
			id: result.user.id,
			email: result.user.email,
			name: result.user.name,
			role: result.user.role,
			emailVerified: result.user.emailVerified
		}
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionCookie(event: RequestEvent, sessionId: string): void {
	// Only use secure cookies if actually on HTTPS
	const isHttps = event.request.url.startsWith('https://');

	event.cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: '/',
		httpOnly: true,
		secure: isHttps,
		sameSite: 'lax',
		maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60
	});
}

export function deleteSessionCookie(event: RequestEvent): void {
	event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSessionId(event: RequestEvent): string | undefined {
	return event.cookies.get(SESSION_COOKIE_NAME);
}

// Token generation
export function generateToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Email verification
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

export async function createEmailVerificationToken(userId: number): Promise<string> {
	// Delete any existing tokens for this user
	await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId));

	const token = generateToken();
	const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

	await db.insert(emailVerificationTokens).values({
		userId,
		token,
		expiresAt
	});

	return token;
}

export async function verifyEmailToken(token: string): Promise<{ valid: boolean; userId?: number }> {
	const result = await db
		.select()
		.from(emailVerificationTokens)
		.where(eq(emailVerificationTokens.token, token))
		.get();

	if (!result) {
		return { valid: false };
	}

	if (result.expiresAt < new Date()) {
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
		return { valid: false };
	}

	// Mark user as verified
	await db.update(users).set({ emailVerified: true }).where(eq(users.id, result.userId));

	// Delete the token
	await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));

	return { valid: true, userId: result.userId };
}

// Password reset
const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function createPasswordResetToken(userId: number): Promise<string> {
	// Delete any existing tokens for this user
	await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));

	const token = generateToken();
	const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

	await db.insert(passwordResetTokens).values({
		userId,
		token,
		expiresAt
	});

	return token;
}

export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; userId?: number }> {
	const result = await db
		.select()
		.from(passwordResetTokens)
		.where(eq(passwordResetTokens.token, token))
		.get();

	if (!result) {
		return { valid: false };
	}

	if (result.expiresAt < new Date()) {
		await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
		return { valid: false };
	}

	return { valid: true, userId: result.userId };
}

export async function consumePasswordResetToken(token: string): Promise<void> {
	await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
}

export async function invalidateAllUserSessions(userId: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Login rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function checkLoginAttempts(email: string): Promise<{ allowed: boolean; remainingAttempts?: number; lockedUntil?: Date }> {
	const attempt = await db
		.select()
		.from(loginAttempts)
		.where(eq(loginAttempts.email, email.toLowerCase()))
		.get();

	if (!attempt) {
		return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
	}

	// Check if locked
	if (attempt.lockedUntil && attempt.lockedUntil > new Date()) {
		return { allowed: false, lockedUntil: attempt.lockedUntil };
	}

	// Reset if lockout has expired
	if (attempt.lockedUntil && attempt.lockedUntil <= new Date()) {
		await db.delete(loginAttempts).where(eq(loginAttempts.email, email.toLowerCase()));
		return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
	}

	const remaining = MAX_LOGIN_ATTEMPTS - attempt.attempts;
	return { allowed: remaining > 0, remainingAttempts: Math.max(0, remaining) };
}

export async function recordFailedLogin(email: string): Promise<{ locked: boolean; lockedUntil?: Date }> {
	const attempt = await db
		.select()
		.from(loginAttempts)
		.where(eq(loginAttempts.email, email.toLowerCase()))
		.get();

	const newAttempts = (attempt?.attempts || 0) + 1;

	if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
		const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);

		if (attempt) {
			await db
				.update(loginAttempts)
				.set({ attempts: newAttempts, lockedUntil })
				.where(eq(loginAttempts.email, email.toLowerCase()));
		} else {
			await db.insert(loginAttempts).values({
				email: email.toLowerCase(),
				attempts: newAttempts,
				lockedUntil
			});
		}

		return { locked: true, lockedUntil };
	}

	if (attempt) {
		await db
			.update(loginAttempts)
			.set({ attempts: newAttempts })
			.where(eq(loginAttempts.email, email.toLowerCase()));
	} else {
		await db.insert(loginAttempts).values({
			email: email.toLowerCase(),
			attempts: newAttempts
		});
	}

	return { locked: false };
}

export async function clearLoginAttempts(email: string): Promise<void> {
	await db.delete(loginAttempts).where(eq(loginAttempts.email, email.toLowerCase()));
}
