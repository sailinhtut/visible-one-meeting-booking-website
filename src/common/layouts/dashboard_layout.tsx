import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import visibleOneLogo from '../../assets/images/visible_one.svg';
import auth_service from '../../auth/services/auth_service';
import user_service from '../../auth/services/user_service';

export default function DashboardLayout() {
	const location = useLocation();
	const [open, setOpen] = useState(false);

	const user = user_service.getCurrentUser();

	const navItems = [
		{ name: 'Bookings', path: '/dashboard/bookings' },

		...(user?.role === 'admin' ? [{ name: 'Users', path: '/dashboard/users' }] : []),

		{ name: 'Profile', path: '/dashboard/profile' },
	];

	return (
		<div className='min-h-screen bg-base-100 flex flex-col'>
			{open && (
				<div
					className='fixed inset-0 bg-black/30 z-40 lg:hidden'
					onClick={() => setOpen(false)}
				/>
			)}

			<header className='h-15 border-b border-base-300 flex items-center justify-between px-3 sticky top-0 z-50 bg-base-100'>
				<button className='lg:hidden' onClick={() => setOpen(true)}>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'>
						<path d='M4 6h16M4 12h16M4 18h16' />
					</svg>
				</button>

				<Link
					to='/dashboard'
					className='py-3 flex flex-row items-center justify-start gap-3'>
					<img src={visibleOneLogo} alt='Visible One' className='size-5' />
					<p className='text-lg font-semibold'>Meeting Booking</p>
				</Link>

				<div className='dropdown dropdown-end'>
					<label
						tabIndex={0}
						className='flex items-center gap-3 cursor-pointer text-sm font-medium hover:opacity-80'>
						<div className='w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-semibold'>
							{user?.name?.charAt(0).toUpperCase()}
						</div>

						<span className='hidden sm:inline'>{user?.name || 'User'}</span>

						<svg
							className='w-4 h-4 opacity-60'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'>
							<path d='M6 9l6 6 6-6' />
						</svg>
					</label>

					<ul
						tabIndex={0}
						className='dropdown-content mt-3 w-48 bg-base-100 border border-base-300 rounded-md shadow-lg text-sm overflow-hidden'>
						<li>
							<Link
								to='/dashboard/profile'
								className='flex items-center gap-2 px-4 py-2 hover:bg-base-200'>
								Profile
							</Link>
						</li>

						<li>
							<button
								onClick={() =>
									(
										document.getElementById(
											'logout_modal',
										) as HTMLDialogElement
									)?.showModal()
								}
								className='flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 w-full text-left'>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</header>

			<div className='min-h-screen'>
				<div
					className={`
				   fixed z-40
				  h-full w-56 bg-base-100 border-r border-base-300
				  transform transition-transform duration-200
				  ${open ? 'translate-x-0' : '-translate-x-full'}
				  lg:translate-x-0
				`}>
					<nav className='p-3 space-y-1 h-full'>
						{navItems.map((item) => {
							const active = location.pathname === item.path;

							return (
								<Link
									key={item.path}
									to={item.path}
									onClick={() => setOpen(false)}
									className={`
						  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold
						  transition-all
						  ${active ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
						`}>
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>

				<main className='lg:ml-56'>
					<Outlet />
				</main>
			</div>

			<dialog id='logout_modal' className='modal'>
				<div className='modal-box max-w-sm'>
					<h3 className='font-semibold text-lg'>Confirm Logout</h3>
					<p className='py-3 text-sm opacity-70'>
						Are you sure you want to logout from your account?
					</p>

					<div className='modal-action'>
						<form method='dialog' className='flex gap-2'>
							<button className='btn btn-sm'>Cancel</button>
						</form>

						<button
							className='btn btn-sm btn-error'
							onClick={() => {
								auth_service.logout();
								(
									document.getElementById(
										'logout_modal',
									) as HTMLDialogElement
								)?.close();
							}}>
							Logout
						</button>
					</div>
				</div>
			</dialog>
		</div>
	);
}
