// Reactive auth state menggunakan Svelte 5 runes
// Untuk client-side state management

import type { UserResponse } from '$lib/types/auth';

// Class untuk mengelola state autentikasi
class AuthStore {
	// State user yang sedang login
	user = $state<UserResponse | null>(null);
	
	// Loading state saat proses autentikasi
	isLoading = $state(false);
	
	// Computed: cek apakah user sudah terautentikasi
	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	// Set user data setelah login berhasil
	setUser(user: UserResponse | null) {
		this.user = user;
	}

	// Set loading state
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	// Clear user data saat logout
	clear() {
		this.user = null;
		this.isLoading = false;
	}
}

// Export singleton instance
export const authStore = new AuthStore();
