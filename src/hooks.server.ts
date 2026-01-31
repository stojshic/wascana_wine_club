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
			console.error('Error name:', (error as Error).name);
			console.error('Error message:', (error as Error).message);
			console.error('Error stack:', (error as Error).stack);
			if (error && typeof error === 'object' && 'cause' in error) {
				console.error('Error cause:', (error as { cause: unknown }).cause);
			}
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
