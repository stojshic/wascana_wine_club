import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wines } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const wineId = parseInt(params.id);

	if (isNaN(wineId)) {
		error(404, 'Wine not found');
	}

	const wine = await db.select().from(wines).where(eq(wines.id, wineId)).get();

	if (!wine) {
		error(404, 'Wine not found');
	}

	return { wine };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const wineId = parseInt(params.id);

		if (isNaN(wineId)) {
			return fail(400, { error: 'Invalid wine' });
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const priceStr = formData.get('price')?.toString();
		const stockStr = formData.get('stock')?.toString();
		const maxReserveQuantityStr = formData.get('maxReserveQuantity')?.toString();
		const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

		if (!name || !description || !priceStr || !stockStr || !maxReserveQuantityStr) {
			return fail(400, { error: 'All fields are required' });
		}

		const price = parseFloat(priceStr);
		const stock = parseInt(stockStr);
		const maxReserveQuantity = parseInt(maxReserveQuantityStr);

		if (isNaN(price) || price < 0) {
			return fail(400, { error: 'Invalid price' });
		}

		if (isNaN(stock) || stock < 0) {
			return fail(400, { error: 'Invalid stock quantity' });
		}

		if (isNaN(maxReserveQuantity) || maxReserveQuantity < 1) {
			return fail(400, { error: 'Invalid max reserve quantity' });
		}

		await db
			.update(wines)
			.set({
				name,
				description,
				price,
				stock,
				maxReserveQuantity,
				imageUrl
			})
			.where(eq(wines.id, wineId));

		redirect(302, '/admin/wines');
	}
};
