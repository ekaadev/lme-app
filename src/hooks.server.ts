// SvelteKit server hooks untuk autentikasi
// Validasi JWT dari http-only cookie pada setiap request

import type { Handle } from '@sveltejs/kit';
import type { UserResponse } from '$lib/types/auth';

// Base URL untuk API backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const handle: Handle = async ({ event, resolve }) => {
	// Ambil cookie jwt dari request
	const jwtCookie = event.cookies.get('jwt');

	// Default: user tidak terautentikasi
	event.locals.user = null;

	// Jika ada cookie, validasi dengan memanggil API /users/me
	if (jwtCookie) {
		try {
			const response = await fetch(`${API_BASE_URL}/users/me`, {
				headers: {
					Cookie: `jwt=${jwtCookie}`
				}
			});

			if (response.ok) {
				const user: UserResponse = await response.json();
				event.locals.user = user;
			}
		} catch (error) {
			// Jika gagal fetch, user tetap null (tidak terautentikasi)
			console.error('Failed to validate JWT:', error);
		}
	}

	return resolve(event);
};
