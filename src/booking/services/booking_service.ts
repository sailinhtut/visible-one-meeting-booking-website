import APIService from '../../common/services/api_service';
import { Booking } from '../models/booking';

class BookingService {
	getAll() {
		return APIService.get<Booking[]>('/bookings');
	}

	getById(id: string) {
		return APIService.get<Booking>(`/bookings/${id}`);
	}

	create(data: Partial<Booking>) {
		return APIService.post<Booking>('/bookings', data);
	}

	update(id: string, data: Partial<Booking>) {
		return APIService.put<Booking>(`/bookings/${id}`, data);
	}

	delete(id: string) {
		return APIService.delete(`/bookings/${id}`);
	}
}

export default new BookingService();
