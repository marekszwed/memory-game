import { hideScoreboard, showScoreboard } from './_scoreboard.ts';
import { GameLevels, gameLevels } from './_types.ts';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { createApi } from 'unsplash-js';
import showToast from './_helpers.ts';

const unsplash = createApi({
	accessKey: '',
});

const modal = document.querySelector('.dialog') as HTMLDivElement;
const game = document.querySelector('.js-app') as HTMLDivElement;
const gameGrid = document.querySelector('.js-game') as HTMLDivElement;
const cards = document.querySelectorAll('.card');
// const ulContainer = document.querySelector('.js-game') as HTMLUListElement;
const nameInput = document.querySelector('.js-input-name') as HTMLInputElement;
// const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;

// Buttons
const playButton = document.querySelector(
	'.js-play-button'
) as HTMLButtonElement;
const restartButton = document.querySelector(
	'.js-restart-game'
) as HTMLButtonElement;
// Hidden class
const hiddenClass = 'hidden';

const imgItemsArray: Array<HTMLImageElement> = [];

const imageArray: Basic[] = [];

// attempts
let attemptCounter = 0;
const maxAttempts = 2;

let playerScore = 0;
let computerScore = 0;

const validateAndCloseModal = () => {
	if (nameInput.value.trim()) {
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
		checkChosedValue();
	} else {
		showToast('warning', 'Please select your difficulty level', {});
	}
};

async function checkChosedValue() {
	const chosenValue = localStorage.getItem('selectedInput') as keyof GameLevels;
	const chosedValue = gameLevels[chosenValue] || gameLevels.easy;

	await fetchData(chosedValue);
	return chosedValue;
}

async function fetchData(chosedValue: number) {
	try {
		unsplash.search
			.getPhotos({ query: 'star-wars', orientation: 'portrait', perPage: 30 })
			.then((result) => {
				if (!result.response?.total) {
					showToast('error', 'Cannot get API data');
				} else {
					result.response.results.forEach((item) => imageArray.push(item));
					shuffleArray(imageArray);
					addItems(chosedValue, imageArray);
				}
			});
	} catch (error) {
		showToast('error', 'Data fetch failure');
	}
}

function shuffleArray(imageArray: Basic[]) {
	for (let i = 0; i < imageArray.length; i++) {
		const random = Math.floor(Math.random() * imageArray.length);
		[imageArray[i], imageArray[random]] = [imageArray[random], imageArray[i]];
	}
}

function addItems(chosedValue: number, imageArray: Basic[]) {
	const selectedImages = imageArray.slice(0, chosedValue);

	if (selectedImages) {
		selectedImages.forEach((item: Basic, i: number) => {
			const imgItem = document.createElement('img');
			imgItem.classList.add('js-game-img');
			imgItem.id = `${i++}`;
			const imgSource = item.urls.small;
			imgItem.src = imgSource;

			imgItemsArray.push(imgItem);
			gameGrid.appendChild(imgItem);
		});
	} else {
		showToast('error', 'Cannot load images');
	}

	createToFindItem();
}

function createToFindItem() {
	const randomImg = Math.floor(Math.random() * imgItemsArray.length);
	const originalImage = imgItemsArray[randomImg];

	const findContainer: HTMLDivElement =
		document.querySelector('.js-find-container')!;
	const findTitle: HTMLElement = document.querySelector('.js-find-title')!;
	const imgToFind = document.createElement('img');

	imgToFind.id = originalImage.id;
	imgToFind.src = originalImage.src;
	imgToFind.classList.add('image-to-find');
	findContainer.append(imgToFind, findTitle);
}

const checkElements = (event: Event) => {
	const clickedImg = event.target as HTMLElement;
	const imgFind = document.querySelector('.image-to-find') as HTMLImageElement;

	const clickedSrcValue = clickedImg.getAttribute('src');
	const srcToFindValue = imgFind.getAttribute('src');
	const clickedIdValue = clickedImg.getAttribute('id');
	const idToFind = imgFind.getAttribute('id');

	if (attemptCounter >= maxAttempts) {
		showToast('error', 'Brak dalszych prób');
		return;
	}

	if (clickedImg.classList.contains('js-game-img')) {
		attemptCounter++;
		console.log('clicked od the image', clickedImg);
		checkMatch(clickedSrcValue, srcToFindValue, idToFind, clickedIdValue);
	} else {
		showToast('warning', 'You must choose an image');
	}
};

const checkMatch = (
	clickedSrcValue: string | null,
	srcToFindValue: string | null | undefined,
	idToFind: string | null,
	clickedIdValue: string | null
) => {
	if (
		clickedSrcValue !== null &&
		srcToFindValue !== null &&
		clickedIdValue !== null
	) {
		if (clickedSrcValue === srcToFindValue || idToFind === clickedSrcValue) {
			playerScore++;
			showScoreboard(computerScore, playerScore);
			console.log('Match');
		} else {
			computerScore++;
			showScoreboard(computerScore, playerScore);

			console.log('Try again');
		}
	}
	return;
};

game.addEventListener('click', checkElements);

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		validateAndCloseModal();
	});
});
