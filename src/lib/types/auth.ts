// TypeScript types untuk autentikasi
// Sesuai dengan API spec di api/api-spec.yaml

// Request untuk registrasi user baru
export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

// Request untuk login
export interface LoginRequest {
	email: string;
	password: string;
}

// Response data user
export interface UserResponse {
	id: number;
	username: string;
	email: string;
	created_at: string;
	updated_at: string;
}

// Request untuk update user
export interface UserUpdate {
	username?: string;
	email?: string;
	password?: string;
}

// Response message umum
export interface MessageResponse {
	message: string;
	detail?: string;
}

// Response login yang berisi user data
export interface LoginResponse {
	message: string;
	user: UserResponse;
}
