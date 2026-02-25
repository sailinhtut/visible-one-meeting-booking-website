import { createBrowserRouter, Navigate } from 'react-router-dom';
import auth_service from './auth/services/auth_service';
import LoginPage from './auth/pages/login_page';
import RegisterPage from './auth/pages/register_page';
import AuthGuard from './auth/guards/auth_guard';
import ProfilePage from './auth/pages/profile_page';
import UserManagementPage from './auth/pages/user_management_page';
import DashboardLayout from './common/layouts/dashboard_layout';
import NotFoundPage from './common/pages/404_page';
import BookingManagementPage from './booking/pages/booking_management_page';

const router = createBrowserRouter([
	// Public routes
	{
		path: '/login',
		element: auth_service.isAuthenticated() ? (
			<Navigate to='/dashboard/profile' replace />
		) : (
			<LoginPage />
		),
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},

	{
		path: '/dashboard',
		element: (
			<AuthGuard>
				<DashboardLayout />
			</AuthGuard>
		),
		children: [
			{
				path: 'bookings',
				element: <BookingManagementPage />,
				index: true,
			},
			{
				path: 'users',
				element: <UserManagementPage />,
			},
			{
				path: 'profile',
				element: <ProfilePage />,
			},
		],
	},
	{
		path: '/',
		element: (
			<Navigate
				to={auth_service.isAuthenticated() ? '/dashboard/bookings' : '/login'}
				replace
			/>
		),
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);

export default router;
