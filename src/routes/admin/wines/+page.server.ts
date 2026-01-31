import { db } from '$lib/server/db';
import { wines } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allWines = await db
		.select()
		.from(wines)
		.orderBy(desc(wines.createdAt));

	return { wines: allWines };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const wineId = parseInt(formData.get('wineId')?.toString() || '');

		if (isNaN(wineId)) {
			return fail(400, { error: 'Invalid wine ID' });
		}

		await db.delete(wines).where(eq(wines.id, wineId));

		return { success: true };
	}
};
