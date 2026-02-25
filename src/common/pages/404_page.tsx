import { Link } from 'react-router-dom';
import visibleOneLogo from '../../assets/images/visible_one.svg';

export default function NotFoundPage() {
	return (
		<div className='min-h-screen bg-base-200 flex items-center justify-center px-6'>
			<div className='text-center max-w-md w-full'>
				<div className='flex justify-center mb-8'>
					<img src={visibleOneLogo} alt='Visible One' className='h-20 lg:h-32 opacity-90' />
				</div>

				<h1 className='text-3xl font-bold tracking-tight text-primary'>404</h1>

				<h2 className='mt-4 text-xl font-semibold'>Page Not Found</h2>

				<p className='mt-2 text-sm opacity-60 leading-relaxed'>
					The page you are looking for does not exist or has been moved. Please check
					the URL or return to the dashboard.
				</p>

				<div className='mt-8'>
					<Link to='/dashboard/profile' className='btn btn-primary btn-sm px-6'>
						Back to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
