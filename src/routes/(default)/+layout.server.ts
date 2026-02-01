// Load function untuk protected routes
// Redirect ke /login jika user tidak terautentikasi
// Fetch playlists untuk sidebar

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { API_BASE_URL } from '$lib/api/config';
import type { PlaylistResponse } from '$lib/types/playlist';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	// Cek apakah user sudah terautentikasi dari server hooks
	if (!locals.user) {
		// Redirect ke halaman login jika belum login
		throw redirect(303, '/login');
	}

	// Fetch playlists untuk sidebar
	let playlists: PlaylistResponse[] = [];
	const jwtCookie = cookies.get('jwt');

	if (jwtCookie) {
		try {
			const response = await fetch(`${API_BASE_URL}/playlist?skip=0&limit=50`, {
				headers: {
					Cookie: `jwt=${jwtCookie}`
				}
			});

			if (response.ok) {
				playlists = await response.json();
			}
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
		}
	}

	// Return user data dan playlists untuk layout dan child pages
	return {
		user: locals.user,
		playlists
	};
};
