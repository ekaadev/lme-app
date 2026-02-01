// Fungsi-fungsi untuk History API
// CRUD history dan search

import { apiFetch } from './config';
import type {
	HistoryCreate,
	HistoryResponse,
	HistoryListResponse
} from '$lib/types/history';
import type { MessageResponse } from '$lib/types/auth';

// Get semua history user
// GET /history
export async function getHistory(skip: number = 0, limit: number = 20): Promise<HistoryListResponse[]> {
	const params = new URLSearchParams({
		skip: skip.toString(),
		limit: limit.toString()
	});

	return apiFetch<HistoryListResponse[]>(`/history?${params.toString()}`);
}

// Buat history baru
// POST /history
export async function createHistory(data: HistoryCreate): Promise<HistoryResponse> {
	return apiFetch<HistoryResponse>('/history', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// Get history detail
// GET /history/{id}
export async function getHistoryById(id: number): Promise<HistoryResponse> {
	return apiFetch<HistoryResponse>(`/history/${id}`);
}

// Hapus history
// DELETE /history/{id}
export async function deleteHistory(id: number): Promise<MessageResponse> {
	return apiFetch<MessageResponse>(`/history/${id}`, {
		method: 'DELETE'
	});
}

// Cari history
// GET /history/search?q=...
export async function searchHistory(query: string): Promise<HistoryListResponse[]> {
	const params = new URLSearchParams({
		q: query
	});

	return apiFetch<HistoryListResponse[]>(`/history/search/?${params.toString()}`);
}
