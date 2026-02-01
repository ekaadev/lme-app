// TypeScript types untuk Playlist
// Sesuai dengan API spec di api/api-spec.yaml

// Request untuk membuat playlist baru
export interface PlaylistCreate {
	title: string;
	description?: string;
}

// Request untuk update playlist
export interface PlaylistUpdate {
	title?: string;
	description?: string;
}

// Response data playlist
export interface PlaylistResponse {
	id: number;
	title: string;
	description: string;
	user_id: number;
	created_at: string;
	updated_at: string;
}

// Response playlist dengan daftar lagu
export interface PlaylistWithSongsResponse extends PlaylistResponse {
	songs: SongSavedResponse[];
}

// Request untuk menambahkan lagu ke playlist
export interface SongSavedCreate {
	song_title: string;
	song_artist: string;
	playlist_id: number;
}

// Response data lagu yang disimpan
export interface SongSavedResponse {
	id: number;
	song_title: string;
	song_artist: string;
	playlist_id: number;
	created_at: string;
}
