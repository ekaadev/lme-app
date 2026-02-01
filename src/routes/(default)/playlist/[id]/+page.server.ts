// Server load untuk playlist detail page
// Fetch playlist dengan songs

import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$lib/api/config';
import type { PlaylistWithSongsResponse } from '$lib/types/playlist';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const playlistId = params.id;
	const jwtCookie = cookies.get('jwt');

	if (!jwtCookie) {
		throw error(401, 'Unauthorized');
	}

	try {
		const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}`, {
			headers: {
				Cookie: `jwt=${jwtCookie}`
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Playlist not found');
			}
			throw error(response.status, 'Failed to load playlist');
		}

		const playlist: PlaylistWithSongsResponse = await response.json();

		return {
			playlist
		};
	} catch (err) {
		console.error('Failed to fetch playlist:', err);
		throw error(500, 'Failed to load playlist');
	}
};
