export type BookingStatus = 'pending' | 'meeting' | 'completed';

export interface BookingUser {
	id: string;
	name: string;
	email: string;
}

export interface Booking {
	id: string;
	userId: BookingUser;
	name: string;
	description: string;
	startTime: string;
	endTime: string;
	status: BookingStatus;
	createdAt: string;
	updatedAt: string;
}
