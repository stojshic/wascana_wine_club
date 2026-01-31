import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wines } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const priceStr = formData.get('price')?.toString();
		const stockStr = formData.get('stock')?.toString();
		const imageUrl = formData.get('imageUrl')?.toString().trim() || null;

		if (!name || !description || !priceStr || !stockStr) {
			return fail(400, {
				error: 'All fields are required',
				name,
				description,
				price: priceStr,
				stock: stockStr,
				imageUrl
			});
		}

		const price = parseFloat(priceStr);
		const stock = parseInt(stockStr);

		if (isNaN(price) || price < 0) {
			return fail(400, {
				error: 'Invalid price',
				name,
				description,
				price: priceStr,
				stock: stockStr,
				imageUrl
			});
		}

		if (isNaN(stock) || stock < 0) {
			return fail(400, {
				error: 'Invalid stock quantity',
				name,
				description,
				price: priceStr,
				stock: stockStr,
				imageUrl
			});
		}

		await db.insert(wines).values({
			name,
			description,
			price,
			stock,
			imageUrl
		});

		redirect(302, '/admin/wines');
	}
};
