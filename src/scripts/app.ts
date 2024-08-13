// import axios from 'axios';
import { GameLevels, gameLevels } from './_types.ts';
import { Photos } from 'unsplash-js/dist/methods/search/types/response';
import showToast from './_helpers.ts';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: '',
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

const imageArray: Photos[] = [];

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
	await addItems(chosedValue, imageArray);
}

async function fetchData() {
	try {
		unsplash.search
			.getPhotos({ query: 'star-wars', orientation: 'portrait', perPage: 30 })
			.then((result) => {
				console.log(result);

				if (!result.response?.results) {
					showToast('error', 'Cannot get API data');
				} else {
					result.response.results.forEach((item) => imageArray.push(item));
				}
			});
	} catch (error) {
		showToast('error', 'Data fetch failure');
	}
}

async function addItems(chosedValue: number, imageArray: object) {
	const liItem = document.createElement('li');
	const imgItem = document.createElement('img');
	const blankItem = document.createElement('div');

	console.log(chosedValue);
	console.log(imageArray);

	blankItem.classList.add('blank-background');
	liItem.append(imgItem, blankItem);
	gameContainer.appendChild(liItem);
}

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		closeModal();
	});
});
