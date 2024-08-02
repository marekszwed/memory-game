import axios from 'axios';
import Toastify from 'toastify-js';

const modal = document.querySelector('.dialog') as HTMLDivElement;
const game = document.querySelector('.js-app') as HTMLDivElement;
const gameContainer = document.querySelector('.js-game') as HTMLDivElement;
const nameInput = document.querySelector('.js-input-name') as HTMLInputElement;
// Buttons
const playButton = document.querySelector(
	'.js-play-button'
) as HTMLButtonElement;
const restartButton = document.querySelector(
	'.js-restart-game'
) as HTMLButtonElement;
// Hidden class
const hiddenClass: string = 'hidden';
// URL
const API_KEY = '28be1067';
const API_LINK = 'http://www.omdbapi.com/?t=Star+Wars&apikey=';
const URL = API_LINK + API_KEY;

let numberOfImage: number;

const closeModal = () => {
	if (nameInput.value) {
		modal.classList.add(hiddenClass);
		game.classList.remove(hiddenClass);
	} else {
		Toastify({
			text: 'Please add your nickname',
			duration: 3000,
			newWindow: true,
			close: true,
			gravity: 'top', // `top` or `bottom`
			position: 'center', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: 'linear-gradient(to right, #00b09b, #96c93d)',
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
};

const setDifficulty = () => {
	const selectedInput = document.querySelector(
		'input[name="choose"]:checked'
	) as HTMLInputElement;

	if (selectedInput) {
		const selectedValue = selectedInput.value;
		localStorage.setItem('selectedInput', selectedValue);
	} else {
		console.log('Nothing clicked');
	}
};

const setGrid = () => {
	const chosenValue = localStorage.getItem('selectedInput');
	console.log(chosenValue);

	switch (chosenValue) {
		case 'easy':
			numberOfImage = 8;
			break;
		case 'medium':
			numberOfImage = 16;
			break;
		case 'hard':
			numberOfImage = 20;
			break;
		default:
			numberOfImage = 8;
	}

	addItems();
};

async function fetchData() {
	await axios.get(URL).then((res) => {
		console.log(res.data);
	});
}
// checking axios response
fetchData();

const addItems = () => {
	const liItem = document.createElement('li');
	const imgItem = document.createElement('img');
	const blankItem = document.createElement('div');
	blankItem.classList.add('blank-background');
	liItem.append(imgItem, blankItem);
	gameContainer.appendChild(liItem);
};

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		closeModal();
		setDifficulty();
		setGrid();
	});
});
