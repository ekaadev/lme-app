// Server load untuk history detail page

import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$lib/api/config';
import type { HistoryResponse } from '$lib/types/history';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const historyId = params.id;
	const jwtCookie = cookies.get('jwt');

	if (!jwtCookie) {
		throw error(401, 'Unauthorized');
	}

	try {
		const response = await fetch(`${API_BASE_URL}/history/${historyId}`, {
			headers: {
				Cookie: `jwt=${jwtCookie}`
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'History not found');
			}
			throw error(response.status, 'Failed to load history');
		}

		const history: HistoryResponse = await response.json();

		return {
			history
		};
	} catch (err) {
		console.error('Failed to fetch history:', err);
		throw error(500, 'Failed to load history');
	}
};
