import { validateSession, getSessionId } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionId(event);

	if (sessionId) {
		const { user } = await validateSession(sessionId);
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
