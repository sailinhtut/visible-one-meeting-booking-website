import { createRoot } from 'react-dom/client';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
	type?: ToastType;
	duration?: number;
}

function createToast(message: string, options?: ToastOptions) {
	const { type = 'info', duration = 3000 } = options || {};

	const container = document.createElement('div');
	document.body.appendChild(container);

	const root = createRoot(container);

	const alertClass = {
		success: 'alert-success',
		error: 'alert-error',
		info: 'alert-info',
		warning: 'alert-warning',
	}[type];

	root.render(
		<div className='toast toast-top toast-end z-[9999]'>
			<div className={`alert ${alertClass} shadow-lg`}>
				<span className='text-sm'>{message}</span>
			</div>
		</div>,
	);

	setTimeout(() => {
		root.unmount();
		document.body.removeChild(container);
	}, duration);
}

export const Toast = {
	show(message: string, options?: ToastOptions) {
		createToast(message, options);
	},

	success(message: string, duration?: number) {
		createToast(message, { type: 'success', duration });
	},

	error(message: string, duration?: number) {
		createToast(message, { type: 'error', duration });
	},

	info(message: string, duration?: number) {
		createToast(message, { type: 'info', duration });
	},

	warning(message: string, duration?: number) {
		createToast(message, { type: 'warning', duration });
	},
};
