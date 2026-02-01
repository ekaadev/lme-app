// Server load untuk halaman login
// Redirect ke /new jika user sudah terautentikasi

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Jika user sudah login, redirect ke halaman utama
	if (locals.user) {
		throw redirect(303, '/new');
	}

	return {};
};
