import { validateSession, getSessionId } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionId(event);

	if (sessionId) {
		try {
			const { user } = await validateSession(sessionId);
			event.locals.user = user;
		} catch (error) {
			console.error('Session validation error:', error);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
