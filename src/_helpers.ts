import Toastify from 'toastify-js';

const showToast = (variant: 'success' | 'warning' | 'error', text: string) => {
	const style = {
		success: 'linear-gradient(to right, #00b09b, #96c93d)',
		warning: '#fd9900',
		error: '#fd3a00',
	};

	const background = style[variant];

	Toastify({
		text: text,
		duration: 3000,
		newWindow: true,
		close: true,
		gravity: 'top', // `top` or `bottom`
		position: 'center', // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: background,
		},
		onClick: function () {}, // Callback after click
	}).showToast();
};

export default showToast;
