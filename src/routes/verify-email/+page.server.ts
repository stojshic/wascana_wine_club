import { redirect } from '@sveltejs/kit';
import { verifyEmailToken } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return {
			success: false,
			error: 'No verification token provided'
		};
	}

	const result = await verifyEmailToken(token);

	if (!result.valid) {
		return {
			success: false,
			error: 'Invalid or expired verification link. Please request a new one.'
		};
	}

	return {
		success: true
	};
};
