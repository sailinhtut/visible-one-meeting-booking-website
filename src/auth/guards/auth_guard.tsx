import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import auth_service from '../services/auth_service';

export default function AuthGuard({ children }: { children: JSX.Element }) {
	if (!auth_service.isAuthenticated()) {
		return <Navigate to='/login' replace />;
	}

	return children;
}
