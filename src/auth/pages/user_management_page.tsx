import { useEffect, useState } from 'react';
import userService from '../services/user_service';
import { User } from '../models/user';
import { Toast } from '../../common/components/toast';
import { capitalizeFirstLetter } from '../../common/utils/general_utils';

type Role = 'user' | 'owner' | 'admin';

export default function UserManagementPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogLoading, setDialogLoading] = useState(false);

	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const [updateName, setUpdateName] = useState('');
	const [updatePassword, setUpdatePassword] = useState('');
	const [updateRole, setUpdateRole] = useState<Role>('user');

	const [dialogError, setDialogError] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			const res = await userService.getAllUsers();
			setUsers(res.data);
		} catch (err: any) {
			Toast.error(err?.response?.data?.message || 'Failed to load users');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleUpdate = async () => {
		if (!selectedUser) return;

		try {
			setDialogLoading(true);
			setDialogError(null);

			const payload: any = {
				name: updateName,
				role: updateRole,
			};

			if (updatePassword.trim() !== '') {
				payload.password = updatePassword;
			}

			await userService.updateUser(selectedUser.id, payload);

			Toast.success('User updated');
			await fetchUsers();

			(document.getElementById('update_dialog') as HTMLDialogElement)?.close();
		} catch (err: any) {
			setDialogError(err || 'Update failed');
		} finally {
			setDialogLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedUser) return;

		try {
			setDialogLoading(true);
			setDialogError(null);

			await userService.deleteUser(selectedUser.id);

			Toast.success('User deleted');
			await fetchUsers();

			(document.getElementById('delete_dialog') as HTMLDialogElement)?.close();
		} catch (err: any) {
			setDialogError(err || 'Delete failed');
		} finally {
			setDialogLoading(false);
		}
	};

	return (
		<div className='p-5'>
			<div className='space-y-6'>
				{/* Header */}
				<div>
					<p className='text-lg font-semibold'>User Management</p>
					<p className='text-sm'>Manage system users</p>
				</div>

				{/* Loading */}
				{loading && (
					<div className='flex justify-center py-10'>
						<span className='loading loading-spinner loading-md'></span>
					</div>
				)}

				{!loading && users.length === 0 && (
					<div className='flex justify-start'>
						<p className='text-sm text-base-content/60'>No users found</p>
					</div>
				)}

				{!loading && (
					<div className='overflow-x-auto border border-base-300 '>
						<table className='table table-sm'>
							<thead className='bg-base-200 text-xs uppercase'>
								<tr>
									<th className='w-10'>No.</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th className='text-right'>Action</th>
								</tr>
							</thead>
							<tbody>
								{users.length === 0 && (
									<tr>
										<td
											colSpan={4}
											className='text-center py-6 text-sm'>
											No users found
										</td>
									</tr>
								)}

								{users.map((u,index) => (
									<tr key={u.id} className='text-sm'>
										<td>{index + 1}.</td>
										<td>
											<button
												onClick={() => {
													setSelectedUser(u);
													(
														document.getElementById(
															'view_dialog',
														) as HTMLDialogElement
													)?.showModal();
												}}
												className='hover:underline font-medium'>
												{u.name}
											</button>
										</td>
										<td>{u.email}</td>
										<td>
											<span className='badge badge-primary badge-sm'>
												{capitalizeFirstLetter(u.role)}
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
												<ul
													tabIndex={0}
													className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 text-sm'>
													<li>
														<button
															onClick={() => {
																setSelectedUser(u);
																setDialogError(
																	null,
																);
																(
																	document.getElementById(
																		'view_dialog',
																	) as HTMLDialogElement
																)?.showModal();
															}}>
															View Detail
														</button>
													</li>
													<li>
														<button
															onClick={() => {
																setSelectedUser(u);
																setUpdateRole(
																	u.role as Role,
																);
																setUpdateName(
																	u.name,
																);
																setUpdatePassword(
																	'',
																);
																setDialogError(
																	null,
																);

																(
																	document.getElementById(
																		'update_dialog',
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
																setSelectedUser(u);
																setDialogError(
																	null,
																);
																(
																	document.getElementById(
																		'delete_dialog',
																	) as HTMLDialogElement
																)?.showModal();
															}}>
															Delete
														</button>
													</li>
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

			<dialog id='view_dialog' className='modal'>
				<div className='modal-box space-y-3'>
					<h3 className='font-semibold text-lg'>User Detail</h3>

					{selectedUser && (
						<div className='space-y-2 text-sm'>
							<div className='flex justify-between'>
								<span>ID</span>
								<span className='font-medium'>{selectedUser.id}</span>
							</div>
							<div className='flex justify-between'>
								<span>Name</span>
								<span className='font-medium'>{selectedUser.name}</span>
							</div>
							<div className='flex justify-between'>
								<span>Email</span>
								<span className='font-medium'>{selectedUser.email}</span>
							</div>
							<div className='flex justify-between'>
								<span>Role</span>
								<span className='badge badge-primary badge-sm'>
									{capitalizeFirstLetter(selectedUser.role)}
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

			<dialog id='update_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg'>Update User</h3>

					{dialogError && (
						<div className='alert alert-error text-sm'>{dialogError}</div>
					)}

					<div className='space-y-1'>
						<label className='text-sm'>Name</label>
						<input
							type='text'
							className='input input-bordered input-sm w-full'
							value={updateName}
							onChange={(e) => setUpdateName(e.target.value)}
						/>
					</div>

					<div className='space-y-1'>
						<label className='text-sm'>Password (optional)</label>
						<input
							type='password'
							className='input input-bordered input-sm w-full'
							placeholder='Leave empty to keep current password'
							value={updatePassword}
							onChange={(e) => setUpdatePassword(e.target.value)}
						/>
					</div>

					<div className='space-y-1'>
						<label className='text-sm'>Role</label>
						<select
							className='select select-bordered select-sm w-full'
							value={updateRole}
							onChange={(e) => setUpdateRole(e.target.value as Role)}>
							<option value='user'>User</option>
							<option value='owner'>Owner</option>
							<option value='admin'>Admin</option>
						</select>
					</div>

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

			<dialog id='delete_dialog' className='modal'>
				<div className='modal-box space-y-4'>
					<h3 className='font-semibold text-lg text-error'>Confirm Delete</h3>

					{dialogError && (
						<div className='alert alert-error text-sm'>{dialogError}</div>
					)}

					<p className='text-sm'>Are you sure you want to delete this user?</p>

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
