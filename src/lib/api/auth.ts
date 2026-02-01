// Fungsi-fungsi untuk autentikasi API
// Menggunakan http-only cookies untuk JWT

import { apiFetch } from './config';
import type {
	RegisterRequest,
	LoginRequest,
	UserResponse,
	MessageResponse,
	LoginResponse
} from '$lib/types/auth';

// Registrasi user baru
// POST /auth/register
export async function register(data: RegisterRequest): Promise<UserResponse> {
	return apiFetch<UserResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// Login user
// POST /auth/login - Response akan set http-only cookie
export async function login(data: LoginRequest): Promise<LoginResponse> {
	return apiFetch<LoginResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// Logout user
// POST /auth/logout - Response akan clear http-only cookie
export async function logout(): Promise<MessageResponse> {
	return apiFetch<MessageResponse>('/auth/logout', {
		method: 'POST'
	});
}

// Refresh access token
// POST /auth/refresh
export async function refreshToken(): Promise<MessageResponse> {
	return apiFetch<MessageResponse>('/auth/refresh', {
		method: 'POST'
	});
}

// Get current user data
// GET /users/me - Memerlukan autentikasi
export async function getCurrentUser(): Promise<UserResponse> {
	return apiFetch<UserResponse>('/users/me');
}
