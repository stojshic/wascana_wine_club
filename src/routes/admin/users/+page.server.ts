import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allUsers = await db
		.select({
			id: users.id,
			email: users.email,
			name: users.name,
			role: users.role,
			createdAt: users.createdAt
		})
		.from(users)
		.orderBy(desc(users.createdAt));

	return {
		users: allUsers
	};
};

export const actions: Actions = {
	updateRole: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = parseInt(formData.get('userId')?.toString() || '');
		const newRole = formData.get('role')?.toString() as 'customer' | 'admin';

		if (isNaN(userId)) {
			return fail(400, { error: 'Invalid user ID' });
		}

		if (!newRole || !['customer', 'admin'].includes(newRole)) {
			return fail(400, { error: 'Invalid role' });
		}

		// Prevent admin from demoting themselves
		if (locals.user?.id === userId && newRole !== 'admin') {
			return fail(400, { error: 'You cannot demote yourself' });
		}

		await db
			.update(users)
			.set({ role: newRole })
			.where(eq(users.id, userId));

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = parseInt(formData.get('userId')?.toString() || '');

		if (isNaN(userId)) {
			return fail(400, { error: 'Invalid user ID' });
		}

		// Prevent admin from deleting themselves
		if (locals.user?.id === userId) {
			return fail(400, { error: 'You cannot delete yourself' });
		}

		await db.delete(users).where(eq(users.id, userId));

		return { success: true };
	}
};
