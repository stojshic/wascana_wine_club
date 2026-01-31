import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reservations, wines } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const userReservations = await db
		.select({
			id: reservations.id,
			quantity: reservations.quantity,
			status: reservations.status,
			createdAt: reservations.createdAt,
			wine: {
				id: wines.id,
				name: wines.name,
				price: wines.price,
				imageUrl: wines.imageUrl
			}
		})
		.from(reservations)
		.innerJoin(wines, eq(reservations.wineId, wines.id))
		.where(eq(reservations.userId, locals.user.id))
		.orderBy(desc(reservations.createdAt));

	return {
		user: locals.user,
		reservations: userReservations
	};
};

export const actions: Actions = {
	cancel: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const reservationId = parseInt(formData.get('reservationId')?.toString() || '');

		if (isNaN(reservationId)) {
			return fail(400, { error: 'Invalid reservation' });
		}

		const reservation = await db
			.select()
			.from(reservations)
			.where(eq(reservations.id, reservationId))
			.get();

		if (!reservation) {
			return fail(404, { error: 'Reservation not found' });
		}

		if (reservation.userId !== locals.user.id) {
			return fail(403, { error: 'Not authorized' });
		}

		if (reservation.status !== 'pending') {
			return fail(400, { error: 'Only pending reservations can be cancelled' });
		}

		// Cancel reservation and restore stock
		await db
			.update(reservations)
			.set({ status: 'cancelled' })
			.where(eq(reservations.id, reservationId));

		await db
			.update(wines)
			.set({ stock: sql`${wines.stock} + ${reservation.quantity}` })
			.where(eq(wines.id, reservation.wineId));

		return { success: true };
	}
};
