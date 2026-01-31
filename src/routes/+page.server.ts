import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wines } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const allWines = await db
		.select()
		.from(wines)
		.orderBy(desc(wines.createdAt));

	return {
		wines: allWines,
		user: locals.user
	};
};
