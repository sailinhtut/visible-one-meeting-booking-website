import APIService from '../../common/services/api_service';
import { User } from '../models/user';
import auth_service from './auth_service';

class UserService {
	async fetchProfile() {
		const userId = this.getUserId();
		if (!userId) {
			auth_service.logout();
		}
		const res = await APIService.get<User>(`/users/${userId}`);
		localStorage.setItem('user', JSON.stringify(res.data));
		return res.data;
	}

	async getAllUsers() {
		return APIService.get<User[]>('/users');
	}

	async updateUser(id: string, data: Partial<User>) {
		return APIService.put<User>(`/users/${id}`, data);
	}

	async deleteUser(id: string) {
		return APIService.delete(`/users/${id}`);
	}

	getCurrentUser() {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}

	getUserId() {
		const user = this.getCurrentUser();
		return user?.id;
	}
}

export default new UserService();
