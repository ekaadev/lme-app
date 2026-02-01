// Konfigurasi dasar untuk API client
// Base URL untuk backend API

export const API_BASE_URL = 'http://localhost:8000/api/v1';

// Tipe untuk respons API
export interface ApiError {
	detail: string;
	message?: string;
}

// Helper function untuk fetch dengan credentials
// Menggunakan 'include' agar http-only cookies dikirim otomatis
export async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const response = await fetch(url, {
		...options,
		credentials: 'include', // Penting: untuk mengirim dan menerima cookies
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	// Handle error response
	if (!response.ok) {
		const errorData: ApiError = await response.json().catch(() => ({
			detail: 'Terjadi kesalahan pada server'
		}));
		throw new Error(errorData.detail || errorData.message || 'Request failed');
	}

	// Return parsed JSON
	return response.json();
}
