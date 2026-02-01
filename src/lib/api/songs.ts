// Fungsi-fungsi untuk Songs API
// Search songs dari Genius

import { apiFetch } from './config';
import type { SongSearchResult, ExplainRequest, ExplainResponse } from '$lib/types/songs';

// Search songs dari Genius
// GET /songs/search?q=...&limit=...
export async function searchSongs(query: string, limit: number = 10): Promise<SongSearchResult[]> {
	const params = new URLSearchParams({
		q: query,
		limit: limit.toString()
	});

	return apiFetch<SongSearchResult[]>(`/songs/search?${params.toString()}`);
}

// Explain song lyrics dengan emotion detection
// POST /songs/explain
export async function explainSongs(data: ExplainRequest): Promise<ExplainResponse> {
	return apiFetch<ExplainResponse>('/songs/explain', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}
