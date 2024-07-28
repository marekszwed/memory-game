const modal = document.querySelector('.dialog') as HTMLDivElement;
const game = document.querySelector('.js-app') as HTMLDivElement;
const playButton = document.querySelector(
	'.js-play-button'
) as HTMLButtonElement;
const nameINput = document.querySelector('.js-input-name') as HTMLInputElement;
const difficultyInputs = document.querySelectorAll('.js-check-input');

const closeModal = () => {
	if (nameINput.value !== '') {
		modal.classList.add('hidden');
		game.classList.remove('hidden');
		setDifficulty();
	} else {
		console.log('empty name space');
	}
};

const setDifficulty = () => {};

document.addEventListener('DOMContentLoaded', setDifficulty);
playButton.addEventListener('click', (e) => {
	e.preventDefault();
	closeModal();
});
