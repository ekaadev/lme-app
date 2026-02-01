// Store untuk manajemen lagu yang akan dijelaskan
// Menggunakan Svelte 5 runes untuk reactive state

import type { SongSearchResult } from '$lib/types/songs';

// Tipe song yang dipilih untuk explain
export interface SelectedSong {
	id: number;
	title: string;
	artist: string;
	thumbnail?: string;
}

// Class untuk mengelola state selected songs untuk explain
class ExplainStore {
	// Daftar lagu yang dipilih untuk dijelaskan
	songs = $state<SelectedSong[]>([]);

	// Loading state saat explain
	isLoading = $state(false);

	// Tambah lagu ke list
	addSong(song: SongSearchResult | SelectedSong) {
		// Cek duplikat berdasarkan title + artist
		const exists = this.songs.some(
			(s) => s.title === song.title && s.artist === song.artist
		);

		if (!exists) {
			this.songs = [
				...this.songs,
				{
					id: song.id,
					title: song.title,
					artist: song.artist,
					thumbnail: 'thumbnail' in song ? song.thumbnail : undefined
				}
			];
		}
	}

	// Hapus lagu dari list
	removeSong(id: number) {
		this.songs = this.songs.filter((s) => s.id !== id);
	}

	// Clear semua lagu
	clear() {
		this.songs = [];
	}

	// Set loading state
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	// Cek apakah ada lagu yang dipilih
	get hasSongs(): boolean {
		return this.songs.length > 0;
	}

	// Get jumlah lagu
	get count(): number {
		return this.songs.length;
	}
}

export const explainStore = new ExplainStore();
