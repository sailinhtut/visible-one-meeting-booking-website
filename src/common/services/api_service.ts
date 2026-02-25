import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../configs/api_config';
import auth_service from '../../auth/services/auth_service';
import { Toast } from '../components/toast';

interface ApiErrorResponse {
	message: string;
	error: string;
	statusCode: number;
}

class APIGateWay {
	private static instance: APIGateWay;
	private api: AxiosInstance;

	private constructor() {
		this.api = axios.create({
			baseURL: API_BASE_URL,
			timeout: 10000,
		});

		this.initializeInterceptors();
	}

	public static getInstance(): APIGateWay {
		if (!APIGateWay.instance) {
			APIGateWay.instance = new APIGateWay();
		}
		return APIGateWay.instance;
	}

	private initializeInterceptors() {
		this.api.interceptors.request.use((config) => {
			const token = localStorage.getItem('access_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		this.api.interceptors.response.use(
			(response) => response,
			(error: AxiosError<ApiErrorResponse>) => {
				if (error.response) {
					const message =
						error.response.data?.message || 'Unexpected error occurred';

					if (error.response.status === 401) {
						localStorage.removeItem('access_token');

						Toast.show('Session Expired. Please log in again.', {
							type: 'error',
						});
					}

					return Promise.reject(message);
				}

				return Promise.reject('Network error. Please try again.');
			},
		);
	}

	public get<T>(url: string) {
		return this.api.get<T>(url);
	}

	public post<T>(url: string, data?: unknown) {
		return this.api.post<T>(url, data);
	}

	public put<T>(url: string, data?: unknown) {
		return this.api.put<T>(url, data);
	}

	public delete<T>(url: string) {
		return this.api.delete<T>(url);
	}
}

const APIService = APIGateWay.getInstance();
export default APIService;
