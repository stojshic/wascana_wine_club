import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Public registration is disabled - redirect to login
export const load: PageServerLoad = async () => {
	redirect(302, '/login');
};
