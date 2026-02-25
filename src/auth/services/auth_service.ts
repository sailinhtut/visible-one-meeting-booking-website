// services/auth_service.ts

import APIService from '../../common/services/api_service';

interface LoginResponse {
	access_token: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
	};
}

class AuthService {
	async login(email: string, password: string) {
		const res = await APIService.post<LoginResponse>('/auth/login', {
			email,
			password,
		});

		localStorage.setItem('access_token', res.data.access_token);
		localStorage.setItem('user', JSON.stringify(res.data.user));

		return res.data;
	}

	async register(name: string, email: string, password: string) {
		return APIService.post('/auth/register', {
			name,
			email,
			password,
		});
	}

	logout() {
		localStorage.removeItem('access_token');
		localStorage.removeItem('user');
		window.location.href = '/login';
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem('access_token');
	}
}

export default new AuthService();
