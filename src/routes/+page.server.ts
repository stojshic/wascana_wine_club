import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wines } from '$lib/server/db/schema';
import { desc, or, gt, isNull, and, eq, lte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	// Calculate 7 days ago
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	// Get wines that are either:
	// 1. In stock (stock > 0)
	// 2. Out of stock but for less than 7 days (stock = 0 AND soldOutAt > 7 days ago)
	// 3. Out of stock but never had soldOutAt set (for backwards compatibility)
	const availableWines = await db
		.select()
		.from(wines)
		.where(
			or(
				gt(wines.stock, 0),
				and(eq(wines.stock, 0), isNull(wines.soldOutAt)),
				and(eq(wines.stock, 0), gt(wines.soldOutAt, sevenDaysAgo))
			)
		)
		.orderBy(desc(wines.createdAt));

	// Get wines that have been sold out for more than 7 days
	const soldOutWines = await db
		.select()
		.from(wines)
		.where(
			and(
				eq(wines.stock, 0),
				lte(wines.soldOutAt, sevenDaysAgo)
			)
		)
		.orderBy(desc(wines.soldOutAt));

	return {
		wines: availableWines,
		soldOutWines,
		user: locals.user
	};
};
