// TypeScript types untuk History
// Sesuai dengan API spec di api/api-spec.yaml

// Request untuk membuat history baru
export interface HistoryCreate {
	song_title: string;
	song_artist: string;
	interpretation?: string;
	emotion?: string;
	language_code?: string;
}

// Response detail history
export interface HistoryResponse {
	id: number;
	song_title: string;
	song_artist: string;
	interpretation: string;
	emotion: string;
	language_code: string;
	created_at: string;
	user_id: number;
}

// Response list history (untuk display di list)
export interface HistoryListResponse {
	id: number;
	song_title: string;
	song_artist: string;
	emotion: string;
	created_at: string;
}
