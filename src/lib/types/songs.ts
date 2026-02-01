// TypeScript types untuk Songs
// Sesuai dengan API spec di api/api-spec.yaml

// Hasil pencarian lagu dari Genius
export interface SongSearchResult {
	id: number;
	title: string;
	artist: string;
	thumbnail: string;
	url: string;
}

// Input untuk explain song
export interface SongInput {
	title: string;
	artist: string;
}

// Request untuk explain songs
export interface ExplainRequest {
	songs: SongInput[];
	language_code?: string;
}

// Hasil explain per lagu
export interface ExplainResult {
	id: number;
	song_title: string;
	song_artist: string;
	lyrics: string;
	emotion: EmotionResult;
	interpretation: string;
	error?: string;
}

// Hasil deteksi emosi
export interface EmotionResult {
	emotion: string;
	confidence: number;
	all_emotions: Record<string, number>;
}

// Response explain songs
export interface ExplainResponse {
	results: ExplainResult[];
	total: number;
}
