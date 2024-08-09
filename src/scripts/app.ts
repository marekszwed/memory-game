// import axios from 'axios';
import showToast from './_helpers.ts';
// import createApi from './_unsplashApi.ts';
import { createApi } from 'unsplash-js';

const api = createApi({
	// Don't forget to set your access token here!
	// See https://unsplash.com/developers
	accessKey: import.meta.env.VITE_API_ACCESS_KEY,
});

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
		setDifficulty();
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
		checkChoseValue();
	} else {
		showToast('warning', 'Please select your difficulty level', {});
	}
};

async function checkChoseValue() {
	const chosenValue = localStorage.getItem('selectedInput') as keyof GameLevels;

	const chosedValue = gameLevels[chosenValue] || gameLevels.easy;
	console.log(chosedValue);

	await fetchData();
	await addItems(chosedValue);
}

const fetchData = () => {
	try {
		api.search
			.getPhotos({ query: 'cat', orientation: 'portrait', perPage: 30 })
			.then((result) => {
				console.log(result.response?.results.length);
				const imageArray = [];
				if (result) {
					imageArray.push(result);
				} else {
					showToast('error', 'Something went wrong, please try again later');
				}
				console.log(imageArray);
			});
	} catch (error) {
		showToast('error', 'Data fetch failure');
	}
};

const addItems = (chosedValue: number) => {
	const liItem = document.createElement('li');
	const imgItem = document.createElement('img');
	const blankItem = document.createElement('div');

	blankItem.classList.add('blank-background');
	liItem.append(imgItem, blankItem);
	gameContainer.appendChild(liItem);

	console.log(chosedValue);
};

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		closeModal();
	});
});
