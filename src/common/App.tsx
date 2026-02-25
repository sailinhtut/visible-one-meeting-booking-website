import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import api from './services/api_service';

interface Post {
	id: number;
	title: string;
	body: string;
}

export default function App() {
	return (
		<div className='min-h-screen bg-base-200 flex'>
			{/* Sidebar */}
			<aside className='w-64 bg-base-100 shadow-xl p-5'>
				<h2 className='text-xl font-bold mb-6'>Demo Dashboard</h2>

				<ul className='menu gap-2'>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/posts'>Axios Demo</Link>
					</li>
				</ul>
			</aside>

			{/* Content */}
			<div className='flex-1 flex flex-col'>
				{/* Navbar */}
				<div className='navbar bg-base-100 shadow px-6'>
					<div className='flex-1 font-semibold'>
						{dayjs().format('dddd, MMMM D YYYY HH:mm:ss')}
					</div>
				</div>

				<main className='p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
