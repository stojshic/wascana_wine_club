import { db } from '$lib/server/db';
import { wines, reservations, users } from '$lib/server/db/schema';
import { count, sum, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [wineCount] = await db.select({ count: count() }).from(wines);
	const [userCount] = await db.select({ count: count() }).from(users);
	const [pendingCount] = await db
		.select({ count: count() })
		.from(reservations)
		.where(eq(reservations.status, 'pending'));
	const [readyCount] = await db
		.select({ count: count() })
		.from(reservations)
		.where(eq(reservations.status, 'ready'));

	return {
		stats: {
			wines: wineCount.count,
			users: userCount.count,
			pendingReservations: pendingCount.count,
			readyReservations: readyCount.count
		}
	};
};
