// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { UserResponse } from '$lib/types/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// User yang sedang login, null jika belum terautentikasi
			user: UserResponse | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
