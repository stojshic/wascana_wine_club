import { redirect } from '@sveltejs/kit';
import { invalidateSession, getSessionId, deleteSessionCookie } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const sessionId = getSessionId(event);

		if (sessionId) {
			await invalidateSession(sessionId);
		}

		deleteSessionCookie(event);
		redirect(302, '/');
	}
};
