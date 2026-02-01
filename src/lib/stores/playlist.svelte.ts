// Store untuk manajemen playlist
// Menggunakan Svelte 5 runes untuk reactive state

import type { PlaylistResponse } from '$lib/types/playlist';

// Class untuk mengelola state playlist
class PlaylistStore {
	// Daftar semua playlist user
	playlists = $state<PlaylistResponse[]>([]);

	// Loading state
	isLoading = $state(false);

	// Set playlists dari API
	setPlaylists(playlists: PlaylistResponse[]) {
		this.playlists = playlists;
	}

	// Tambah playlist baru ke list
	addPlaylist(playlist: PlaylistResponse) {
		this.playlists = [playlist, ...this.playlists];
	}

	// Update playlist dalam list
	updatePlaylist(id: number, data: Partial<PlaylistResponse>) {
		this.playlists = this.playlists.map((p) =>
			p.id === id ? { ...p, ...data } : p
		);
	}

	// Hapus playlist dari list
	removePlaylist(id: number) {
		this.playlists = this.playlists.filter((p) => p.id !== id);
	}

	// Set loading state
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	// Hitung jumlah playlist untuk generate nama default
	get nextPlaylistNumber(): number {
		const existingNumbers = this.playlists
			.map((p) => {
				const match = p.title.match(/^My Playlist #(\d+)$/);
				return match ? parseInt(match[1], 10) : 0;
			})
			.filter((n) => n > 0);

		if (existingNumbers.length === 0) return 1;
		return Math.max(...existingNumbers) + 1;
	}

	// Clear store
	clear() {
		this.playlists = [];
		this.isLoading = false;
	}
}

export const playlistStore = new PlaylistStore();
