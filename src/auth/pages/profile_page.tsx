import { useEffect, useState } from 'react';
import userService from '../services/user_service';
import { User } from '../models/user';
import { capitalizeFirstLetter } from '../../common/utils/general_utils';

export default function ProfilePage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const user = await userService.fetchProfile();
				setUser(user);
			} catch (err: any) {
				setError(err || 'Failed to load profile');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	return (
		<div className='p-5'>
			<div className='w-full max-w-sm space-y-6'>
				<div>
					<p className='text-lg font-semibold'>Profile</p>
					<p className='text-sm'>Your account information</p>
				</div>

				{loading && (
					<div className='flex justify-center py-5'>
						<span className='loading loading-spinner loading-md'></span>
					</div>
				)}

				{error && <div className='alert alert-error text-sm'>{error}</div>}

				{!loading && !error && user && (
					<div className='space-y-4'>
						<div className='flex justify-between text-sm'>
							<span className=''>Name</span>
							<span className='font-medium'>{user.name}</span>
						</div>

						<div className='flex justify-between text-sm'>
							<span className=''>Email</span>
							<span className='font-medium'>{user.email}</span>
						</div>

						<div className='flex justify-between text-sm'>
							<span className=''>Role</span>
							<span className='badge badge-primary badge-sm'>
								{capitalizeFirstLetter(user.role)}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
