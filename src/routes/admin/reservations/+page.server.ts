import { db } from '$lib/server/db';
import { reservations, wines, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allReservations = await db
		.select({
			id: reservations.id,
			quantity: reservations.quantity,
			status: reservations.status,
			createdAt: reservations.createdAt,
			wine: {
				id: wines.id,
				name: wines.name,
				price: wines.price
			},
			user: {
				id: users.id,
				name: users.name,
				email: users.email
			}
		})
		.from(reservations)
		.innerJoin(wines, eq(reservations.wineId, wines.id))
		.innerJoin(users, eq(reservations.userId, users.id))
		.orderBy(desc(reservations.createdAt));

	return { reservations: allReservations };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData();
		const reservationId = parseInt(formData.get('reservationId')?.toString() || '');
		const status = formData.get('status')?.toString() as 'pending' | 'ready' | 'completed' | 'cancelled';

		if (isNaN(reservationId)) {
			return fail(400, { error: 'Invalid reservation' });
		}

		if (!['pending', 'ready', 'completed', 'cancelled'].includes(status)) {
			return fail(400, { error: 'Invalid status' });
		}

		await db
			.update(reservations)
			.set({ status })
			.where(eq(reservations.id, reservationId));

		return { success: true };
	}
};
