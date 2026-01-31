import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wines, reservations } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const wineId = parseInt(params.id);

	if (isNaN(wineId)) {
		error(404, 'Wine not found');
	}

	const wine = await db
		.select()
		.from(wines)
		.where(eq(wines.id, wineId))
		.get();

	if (!wine) {
		error(404, 'Wine not found');
	}

	return {
		wine,
		user: locals.user
	};
};

export const actions: Actions = {
	reserve: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'You must be logged in to reserve wine' });
		}

		if (!locals.user.emailVerified) {
			return fail(403, { error: 'Please verify your email before making reservations' });
		}

		const wineId = parseInt(params.id);
		if (isNaN(wineId)) {
			return fail(400, { error: 'Invalid wine' });
		}

		const formData = await request.formData();
		const quantityStr = formData.get('quantity')?.toString();
		const quantity = parseInt(quantityStr || '1');

		if (isNaN(quantity) || quantity < 1) {
			return fail(400, { error: 'Invalid quantity' });
		}

		if (quantity > 10) {
			return fail(400, { error: 'Maximum 10 bottles per reservation' });
		}

		const wine = await db
			.select()
			.from(wines)
			.where(eq(wines.id, wineId))
			.get();

		if (!wine) {
			return fail(404, { error: 'Wine not found' });
		}

		if (wine.stock < quantity) {
			return fail(400, {
				error: wine.stock === 0
					? 'This wine is out of stock'
					: `Only ${wine.stock} bottles available`
			});
		}

		// Create reservation and update stock in a transaction-like manner
		await db.insert(reservations).values({
			userId: locals.user.id,
			wineId: wine.id,
			quantity,
			status: 'pending'
		});

		await db
			.update(wines)
			.set({ stock: sql`${wines.stock} - ${quantity}` })
			.where(eq(wines.id, wineId));

		return { success: true, quantity, wineName: wine.name };
	}
};
