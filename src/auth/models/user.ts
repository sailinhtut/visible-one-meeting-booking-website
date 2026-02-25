export interface User {
	id: string;
	name: string;
	email: string;
	role: 'user' | 'owner' | 'admin';
	createdAt?: string;
}
