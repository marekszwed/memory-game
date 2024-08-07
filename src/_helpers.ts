import Toastify from 'toastify-js';

interface toastifyOptions {
	style?: string;
	duration?: number;
	newWindow: boolean;
	close: boolean;
	gravity: 'top' | 'bottom';
	position: 'left' | 'center' | 'right';
}

const showToast = (
	variant: 'success' | 'warning' | 'error',
	text: string,
	options: Partial<toastifyOptions>
) => {
	const style = {
		success: 'linear-gradient(to right, #00b09b, #96c93d)',
		warning: '#fd9900',
		error: '#fd3a00',
	};

	const background = style[variant];

	Toastify({
		text,
		duration: 3000,
		newWindow: true,
		close: true,
		gravity: 'top', // `top` or `bottom`
		position: 'center', // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background,
		},
		onClick: function () {}, // Callback after click
	}).showToast();

	return { ...Toastify, ...options };
};

export default showToast;
