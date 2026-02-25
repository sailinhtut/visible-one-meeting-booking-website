import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth_service';
import visibleOneLogo from '../../assets/images/visible_one.svg';
import { Toast } from '../../common/components/toast';

export default function RegisterPage() {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleRegister = async () => {
		if (!name || !email || !password) {
			Toast.show('Please fill in all fields', { type: 'error' });
			return;
		}

		setError(null);
		setLoading(true);

		try {
			await authService.register(name, email, password);
			Toast.show('Registration successful!', { type: 'success' });
			navigate('/login');
		} catch (err: any) {
			setError(err || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-base-200 px-4'>
			<div className='w-full max-w-sm bg-base-100 shadow-lg rounded-xl p-6 space-y-6'>
				<div className='text-center space-y-3'>
					<img src={visibleOneLogo} alt='Visible One' className='h-10 mx-auto' />
					<h1 className='text-lg font-semibold tracking-wide'>
						Visible One Meeting Booking
					</h1>
					<p className='text-sm opacity-60'>Create your account</p>
				</div>

				{error && <div className='alert alert-error text-sm'>{error}</div>}

				<input
					className='input input-bordered w-full'
					placeholder='Name'
					onChange={(e) => setName(e.target.value)}
					required
				/>

				<input
					type='email'
					className='input input-bordered w-full'
					placeholder='Email'
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<div className='relative'>
					<input
						type={showPassword ? 'text' : 'password'}
						className='input input-bordered w-full pr-10'
						placeholder='Password'
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100'>
						{showPassword ? (
							/* Eye Off */
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='size-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
								/>
							</svg>
						) : (
							/* Eye */
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='size-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
								/>
							</svg>
						)}
					</button>
				</div>

				<button
					className='btn btn-primary w-full'
					onClick={handleRegister}
					disabled={loading}>
					{loading ? (
						<span className='loading loading-spinner loading-sm'></span>
					) : (
						'Register'
					)}
				</button>

				<p className='text-sm text-center opacity-70'>
					Already have an account?{' '}
					<Link to='/login' className='text-primary font-medium hover:underline'>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
