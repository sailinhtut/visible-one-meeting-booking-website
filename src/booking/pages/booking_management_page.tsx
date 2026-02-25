import { useEffect, useState } from 'react';
import bookingService from '../services/booking_service';
import { Booking, BookingStatus } from '../models/booking';
import { Toast } from '../../common/components/toast';
import { capitalizeFirstLetter } from '../../common/utils/general_utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { User } from '../../auth/models/user';
import user_service from '../../auth/services/user_service';

dayjs.extend(utc);

export default function BookingManagementPage() {
	const [user, setUser] = useState<User | null>(user_service.getCurrentUser());
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogLoading, setDialogLoading] = useState(false);

	const [searchUserId, setSearchUserId] = useState('');
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

	const filteredBookings = bookings.filter((b) =>
		b.userId?.id.toLowerCase().includes(searchUserId.toLowerCase()),
	);

	const [updateName, setUpdateName] = useState('');
	const [updateDescription, setUpdateDescription] = useState('');
	const [updateStartTime, setUpdateStartTime] = useState('');
	const [updateEndTime, setUpdateEndTime] = useState('');
	const [updateStatus, setUpdateStatus] = useState<BookingStatus>('pending');

	const [dialogError, setDialogError] = useState<string | null>(null);

	const [createName, setCreateName] = useState('');
	const [createDescription, setCreateDescription] = useState('');
	const [createFrom, setCreateFrom] = useState('');
	const [createTo, setCreateTo] = useState('');
	const [createStatus, setCreateStatus] = useState<BookingStatus>('pending');

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);

	const canEdit = (booking: Booking) => {
		if (!user) return false;
		if (user.role === 'admin' || user.role === 'owner') return true;
		if (user.role === 'user' && booking.userId.id === user.id) return true;
		return false;
	};

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const res = await bookingService.getAll();
			setBookings(res.data);
		} catch (err: any) {
			Toast.error(err?.response?.data?.message || 'Failed to load bookings');
		} finally {
			setLoading(false);
		}
	};

	const fetchProfile = async () => {
		try {
			const user = await user_service.fetchProfile();
			setUser(user);
			console.log('Current User:', user);
		} catch (err: any) {
			Toast.error(err?.response?.data?.message || 'Failed to load profile');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
		fetchProfile();
	}, []);

	const handleCreate = async () => {
		try {
			setCreateLoading(true);
			setCreateError(null);

			if (!createName.trim()) {
				setCreateError('Name is required');
				return;
			}

			await bookingService.create({
				name: createName,
				description: createDescription,
				// startTime: createFrom,
				// endTime: createTo,
				startTime: dayjs(createFrom).utc().toISOString(),
				endTime: dayjs(createTo).utc().toISOString(),
				status: createStatus,
			});

			Toast.success('Booking created');

			await fetchBookings();

			(document.getElementById('create_dialog') as HTMLDialogElement)?.close();

			// reset fields
			setCreateName('');
			setCreateDescription('');
			setCreateFrom('');
			setCreateTo('');
			setCreateStatus('pending');
		} catch (err: any) {
			setCreateError(err || 'Create failed');
		} finally {
			setCreateLoading(false);
		}
	};

	const handleUpdate = async () => {
		if (!selectedBooking) return;

		try {
			setDialogLoading(true);
			setDialogError(null);

			await bookingService.update(selectedBooking.id, {
				name: updateName,
				description: updateDescription,
				startTime: dayjs(updateStartTime).utc().toISOString(),
				endTime: dayjs(updateEndTime).utc().toISOString(),
				status: updateStatus,
			});

			Toast.success('Booking updated');
			await fetchBookings();

			(document.getElementById('update_booking_dialog') as HTMLDialogElement)?.close();
		} catch (err: any) {
			setDialogError(err || 'Update failed');
		} finally {
			setDialogLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedBooking) return;

		try {
			setDialogLoading(true);
			setDialogError(null);

			await bookingService.delete(selectedBooking.id);

			Toast.success('Booking deleted');
			await fetchBookings();

			(document.getElementById('delete_booking_dialog') as HTMLDialogElement)?.close();
		} catch (err: any) {
			setDialogError(err || 'Delete failed');
		} finally {
			setDialogLoading(false);
		}
	};

	return (
		<div className='p-5'>
			<div className='space-y-6'>
				<div className='flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-center gap-3'>
					<div>
						<p className='text-lg font-semibold'>Booking Management</p>
						<p className='text-sm'>Manage all bookings</p>
					</div>

					<div className='flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-center gap-3'>
						<input
							type='text'
							placeholder='Search by User ID...'
							className='input input-bordered input-sm w-52'
							value={searchUserId}
							onChange={(e) => setSearchUserId(e.target.value)}
						/>

						<div className='flex gap-3'>
							<button
								className='btn btn-primary btn-sm'
								onClick={() => {
									setCreateError(null);
									(
										document.getElementById(
											'create_dialog',
										) as HTMLDialogElement
									)?.showModal();
								}}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke-width='1.5'
									stroke='currentColor'
									className='size-4'>
									<path
										stroke-linecap='round'
										stroke-linejoin='round'
										d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
									/>
								</svg>
								Create Booking
							</button>
							<button
								className='btn btn-sm btn-square'
								onClick={() => {
									fetchBookings();
								}}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth='1.5'
									stroke='currentColor'
									className={`size-4 ${loading ? 'animate-spin' : ''}`}>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{loading && (
					<div className='flex justify-center py-10'>
						<span className='loading loading-spinner loading-md'></span>
					</div>
				)}

				{!loading && filteredBookings.length === 0 && (
					<div className='flex justify-start'>
						<p className='text-sm text-base-content/60'>No bookings found</p>
					</div>
				)}

				{!loading && filteredBookings.length > 0 && (
					<div className='overflow-x-auto border border-base-300'>
						<table className='table table-sm'>
							<thead className='bg-base-200 text-xs uppercase'>
								<tr>
									<th className='w-10'>No.</th>
									<th className='min-w-50'>Name</th>
									<th className='min-w-50'>User</th>
									<th className='min-w-60'>From → To</th>
									<th>Status</th>
									<th className='text-right'>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredBookings.map((b, index) => (
									<tr key={b.id} className='text-sm'>
										<td>{index + 1}.</td>
										<td>
											<button
												onClick={() => {
													setSelectedBooking(b);
													(
														document.getElementById(
															'view_booking_dialog',
														) as HTMLDialogElement
													)?.showModal();
												}}
												className='text-start hover:underline font-medium'>
												{b.name}
											</button>
										</td>
										<td>{b.userId.name}</td>
										<td>
											<div className='flex items-center gap-3 text-sm'>
												<div className='flex flex-col'>
													<span className='font-semibold'>
														{dayjs(b.startTime).format(
															'DD MMM YYYY',
														)}
													</span>
													<span className='text-xs text-base-content/60'>
														{dayjs(b.startTime).format(
															'hh:mm A',
														)}
													</span>
												</div>

												<span className='text-primary font-bold'>
													→
												</span>

												<div className='flex flex-col text-right'>
													<span className='font-semibold'>
														{dayjs(b.endTime).format(
															'DD MMM YYYY',
														)}
													</span>
													<span className='text-xs text-base-content/60'>
														{dayjs(b.endTime).format(
															'hh:mm A',
														)}
													</span>
												</div>
											</div>
										</td>
										<td>
											<span
												className={`badge badge-sm ${
													b.status === 'completed'
														? 'badge-success'
														: b.status === 'meeting'
															? 'badge-warning'
															: 'badge-primary'
												}`}>
												{capitalizeFirstLetter(b.status)}
											</span>
										</td>

										<td className='text-right'>
											<div className='dropdown dropdown-end'>
												<label
													tabIndex={0}
													className='btn btn-ghost btn-xs'>
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
															d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
														/>
													</svg>
												</label>
												<ul className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 text-sm'>
													<li>
														<button
															onClick={() => {
																setSelectedBooking(
																	b,
																);
																setDialogError(
																	null,
																);
																(
																	document.getElementById(
																		'view_booking_dialog',
																	) as HTMLDialogElement
																)?.showModal();
															}}>
															View Detail
														</button>
													</li>

													{canEdit(b) && (
														<>
															<li>
																<button
																	onClick={() => {
																		setSelectedBooking(
																			b,
																		);
																		setUpdateName(
																			b.name,
																		);
																		setUpdateDescription(
																			b.description,
																		);
																		setUpdateStartTime(
																			dayjs
																				.utc(
																					b.startTime,
																				)
																				.local()
																				.format(
																					'YYYY-MM-DDTHH:mm',
																				),
																		);

																		setUpdateEndTime(
																			dayjs
																				.utc(
																					b.endTime,
																				)
																				.local()
																				.format(
																					'YYYY-MM-DDTHH:mm',
																				),
																		);
																		setUpdateStatus(
																			b.status as BookingStatus,
																		);
																		setDialogError(
																			null,
																		);
																		(
																			document.getElementById(
																				'update_booking_dialog',
																			) as HTMLDialogElement
																		)?.showModal();
																	}}>
																	Update
																</button>
															</li>
															<li>
																<button
																	className='text-error'
																	onClick={() => {
																		setSelectedBooking(
																			b,
																		);
																		setDialogError(
																			null,
																		);
																		(
																			document.getElementById(
																				'delete_booking_dialog',
																			) as HTMLDialogElement
																		)?.showModal();
																	}}>
																	Delete
																</button>
															</li>
														</>
													)}
												</ul>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<dialog id='create_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg'>Create Booking</h3>

					{createError && (
						<div className='alert alert-error text-sm'>{createError}</div>
					)}

					{/* Name */}
					<div className='space-y-1'>
						<label className='text-sm'>Name</label>
						<input
							type='text'
							className='input input-bordered input-sm w-full'
							placeholder='Booking title'
							value={createName}
							onChange={(e) => setCreateName(e.target.value)}
						/>
					</div>

					{/* Description */}
					<div className='space-y-1'>
						<label className='text-sm'>Description</label>
						<textarea
							className='textarea textarea-bordered textarea-sm w-full'
							rows={3}
							placeholder='Optional description...'
							value={createDescription}
							onChange={(e) => setCreateDescription(e.target.value)}
						/>
					</div>

					{/* From */}
					<div className='space-y-1'>
						<label className='text-sm'>From</label>
						<input
							type='datetime-local'
							className='input input-bordered input-sm w-full'
							value={createFrom}
							onChange={(e) => setCreateFrom(e.target.value)}
						/>
					</div>

					{/* To */}
					<div className='space-y-1'>
						<label className='text-sm'>To</label>
						<input
							type='datetime-local'
							className='input input-bordered input-sm w-full'
							value={createTo}
							onChange={(e) => setCreateTo(e.target.value)}
						/>
					</div>

					{/* Status */}
					<div className='space-y-1'>
						<label className='text-sm'>Status</label>
						<select
							className='select select-bordered select-sm w-full'
							value={createStatus}
							onChange={(e) =>
								setCreateStatus(e.target.value as BookingStatus)
							}>
							<option value='pending'>Pending</option>
							<option value='meeting'>Meeting</option>
							<option value='completed'>Completed</option>
						</select>
					</div>

					<div className='modal-action'>
						<button
							onClick={handleCreate}
							disabled={createLoading}
							className='btn btn-primary btn-sm'>
							{createLoading ? (
								<span className='loading loading-spinner loading-xs'></span>
							) : (
								'Create'
							)}
						</button>

						<form method='dialog'>
							<button className='btn btn-sm'>Cancel</button>
						</form>
					</div>
				</div>
			</dialog>

			<dialog id='view_booking_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg'>Booking Detail</h3>

					{selectedBooking && (
						<div className='space-y-3 text-sm'>
							<div className='flex justify-between'>
								<span className='text-base-content/60'>ID</span>
								<span className='font-medium'>{selectedBooking.id}</span>
							</div>

							{/* Name */}
							<div className='flex justify-between'>
								<span className='text-base-content/60'>Name</span>
								<span className='font-medium'>{selectedBooking.name}</span>
							</div>

							{/* Description */}
							<div className='flex justify-between items-start'>
								<span className='text-base-content/60'>Description</span>
								<span className='font-medium text-right max-w-xs'>
									{selectedBooking.description || '-'}
								</span>
							</div>

							<div className='pt-2 border-t border-base-300'>
								<div className='text-base-content/60 mb-2'>Schedule</div>

								<div className='flex items-center justify-between'>
									<div className='flex flex-col'>
										<span className='text-xs text-base-content/50'>
											From
										</span>
										<span className='font-semibold'>
											{dayjs
												.utc(selectedBooking.startTime)
												.local()
												.format('DD MMM YYYY hh:mm A')}
										</span>
									</div>

									<span className='text-primary font-bold mx-3'>→</span>

									<div className='flex flex-col text-right'>
										<span className='text-xs text-base-content/50'>
											To
										</span>
										<span className='font-semibold'>
											{dayjs
												.utc(selectedBooking.endTime)
												.local()
												.format('DD MMM YYYY hh:mm A')}
										</span>
									</div>
								</div>
							</div>

							{/* User Info */}
							<div className='pt-2 border-t border-base-300 space-y-2'>
								<div className='text-base-content/60'>Booked By</div>

								<div className='flex justify-between'>
									<span>User ID</span>
									<span className='font-medium'>
										{selectedBooking.userId?.id}
									</span>
								</div>

								<div className='flex justify-between'>
									<span>Name</span>
									<span className='font-medium'>
										{selectedBooking.userId?.name}
									</span>
								</div>

								<div className='flex justify-between'>
									<span>Email</span>
									<span className='font-medium'>
										{selectedBooking.userId?.email}
									</span>
								</div>
							</div>

							<div className='pt-2 border-t border-base-300 flex justify-between'>
								<span className='text-base-content/60'>Status</span>
								<span
									className={`badge badge-sm ${
										selectedBooking.status === 'completed'
											? 'badge-success'
											: selectedBooking.status === 'meeting'
												? 'badge-warning'
												: 'badge-primary'
									}`}>
									{capitalizeFirstLetter(selectedBooking.status)}
								</span>
							</div>
						</div>
					)}

					<div className='modal-action'>
						<form method='dialog'>
							<button className='btn btn-sm'>Close</button>
						</form>
					</div>
				</div>
			</dialog>

			{/* UPDATE DIALOG */}
			<dialog id='update_booking_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg'>Update Booking</h3>

					{dialogError && (
						<div className='alert alert-error text-sm'>{dialogError}</div>
					)}

					<input
						type='text'
						className='input input-bordered input-sm w-full'
						value={updateName}
						onChange={(e) => setUpdateName(e.target.value)}
						placeholder='Name'
					/>

					<textarea
						className='textarea textarea-bordered textarea-sm w-full'
						value={updateDescription}
						onChange={(e) => setUpdateDescription(e.target.value)}
						placeholder='Description'
					/>

					<input
						type='datetime-local'
						className='input input-bordered input-sm w-full'
						value={updateStartTime}
						onChange={(e) => setUpdateStartTime(e.target.value)}
					/>

					<input
						type='datetime-local'
						className='input input-bordered input-sm w-full'
						value={updateEndTime}
						onChange={(e) => setUpdateEndTime(e.target.value)}
					/>

					<select
						className='select select-bordered select-sm w-full'
						value={updateStatus}
						onChange={(e) => setUpdateStatus(e.target.value as BookingStatus)}>
						<option value='pending'>Pending</option>
						<option value='meeting'>Meeting</option>
						<option value='completed'>Completed</option>
					</select>

					<div className='modal-action'>
						<button
							onClick={handleUpdate}
							disabled={dialogLoading}
							className='btn btn-primary btn-sm'>
							{dialogLoading ? (
								<span className='loading loading-spinner loading-xs'></span>
							) : (
								'Save'
							)}
						</button>

						<form method='dialog'>
							<button className='btn btn-sm'>Cancel</button>
						</form>
					</div>
				</div>
			</dialog>

			{/* DELETE DIALOG */}
			<dialog id='delete_booking_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg text-error'>Confirm Delete</h3>

					{dialogError && (
						<div className='alert alert-error text-sm'>{dialogError}</div>
					)}

					<p className='text-sm'>Are you sure you want to delete this booking?</p>

					<div className='modal-action'>
						<button
							onClick={handleDelete}
							disabled={dialogLoading}
							className='btn btn-error btn-sm'>
							{dialogLoading ? (
								<span className='loading loading-spinner loading-xs'></span>
							) : (
								'Delete'
							)}
						</button>

						<form method='dialog'>
							<button className='btn btn-sm'>Cancel</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}
