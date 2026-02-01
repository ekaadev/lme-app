// Fungsi-fungsi untuk Playlist API
// CRUD playlist dan songs

import { apiFetch } from './config';
import type {
	PlaylistCreate,
	PlaylistUpdate,
	PlaylistResponse,
	PlaylistWithSongsResponse,
	SongSavedCreate,
	SongSavedResponse
} from '$lib/types/playlist';
import type { MessageResponse } from '$lib/types/auth';

// Get semua playlists user
// GET /playlist
export async function getPlaylists(skip: number = 0, limit: number = 20): Promise<PlaylistResponse[]> {
	const params = new URLSearchParams({
		skip: skip.toString(),
		limit: limit.toString()
	});

	return apiFetch<PlaylistResponse[]>(`/playlist?${params.toString()}`);
}

// Buat playlist baru
// POST /playlist
export async function createPlaylist(data: PlaylistCreate): Promise<PlaylistResponse> {
	return apiFetch<PlaylistResponse>('/playlist', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// Get playlist detail dengan songs
// GET /playlist/{id}
export async function getPlaylistById(id: number): Promise<PlaylistWithSongsResponse> {
	return apiFetch<PlaylistWithSongsResponse>(`/playlist/${id}`);
}

// Update playlist
// PATCH /playlist/{id}
export async function updatePlaylist(id: number, data: PlaylistUpdate): Promise<PlaylistResponse> {
	return apiFetch<PlaylistResponse>(`/playlist/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}

// Hapus playlist
// DELETE /playlist/{id}
export async function deletePlaylist(id: number): Promise<MessageResponse> {
	return apiFetch<MessageResponse>(`/playlist/${id}`, {
		method: 'DELETE'
	});
}

// Tambah lagu ke playlist
// POST /playlist/{id}/songs
export async function addSongToPlaylist(playlistId: number, song: Omit<SongSavedCreate, 'playlist_id'>): Promise<SongSavedResponse> {
	return apiFetch<SongSavedResponse>(`/playlist/${playlistId}/songs`, {
		method: 'POST',
		body: JSON.stringify({
			...song,
			playlist_id: playlistId
		})
	});
}

// Hapus lagu dari playlist
// DELETE /playlist/{id}/songs/{songId}
export async function removeSongFromPlaylist(playlistId: number, songId: number): Promise<MessageResponse> {
	return apiFetch<MessageResponse>(`/playlist/${playlistId}/songs/${songId}`, {
		method: 'DELETE'
	});
}
