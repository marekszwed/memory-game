import axios from 'axios';
import showToast from './_helpers.ts';

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
const hiddenClass = 'hidden';
// URL
const API_KEY = import.meta.env.VITE_API_KEY;
const API_LINK = 'http://www.omdbapi.com/?t=Star+Wars&apikey=';
const URL = API_LINK + API_KEY;

interface GameLevels {
	easy: number;
	medium: number;
	hard: number;
}

const gameLevels: GameLevels = {
	easy: 8,
	medium: 16,
	hard: 20,
};

const closeModal = () => {
	if (nameInput.value) {
		modal.classList.add(hiddenClass);
		game.classList.remove(hiddenClass);
	} else {
		showToast('warning', 'Please enter your nickname', {});
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
		showToast('warning', 'Please select your difficulty level', {
			position: 'left',
		});
	}
};

const setGrid = () => {
	const chosenValue = localStorage.getItem('selectedInput') as keyof GameLevels;

	const chosedValue = gameLevels[chosenValue] || gameLevels.easy;
	console.log(chosedValue);

	addItems();
};

async function fetchData() {
	// await axios.get(URL).then((res) => {
	// 	console.log(res.data);
	// });
	try {
		const result = await axios.get(URL);
		showToast('success', 'Data fetched successfully');
		console.log(result);
	} catch (e) {
		showToast('error', 'Something went wrong, try again later');
	}
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
