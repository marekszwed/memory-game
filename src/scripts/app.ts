import { showScoreboard } from './_scoreboard.ts';
import { GameLevels, gameLevels } from './_types.ts';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { createApi } from 'unsplash-js';
import showToast from './_helpers.ts';

// import { Photos } from 'unsplash-js/dist/methods/search/types/response';

const unsplash = createApi({
	accessKey: '',
});

const modal = document.querySelector('.dialog') as HTMLDivElement;
const gameSection = document.querySelector('.js-app') as HTMLDivElement;
const gameGrid = document.querySelector('.js-game') as HTMLDivElement;
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

const imgItemsArray: Array<HTMLImageElement> = [];

const fetchArray: Basic[] = [];

// attempts
let ATTEMPT_COUNTER = 0;
const MAX_ATTEMPTS = 2;

let PLAYER_SCORE = 0;
let COMPUTER_SCORE = 0;

const validateAndCloseModal = () => {
	if (nameInput.value.trim()) {
		modal.classList.add(hiddenClass);
		gameSection.classList.remove(hiddenClass);
		setDifficulty();
	} else {
		showToast('warning', 'Please enter your nickname');
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
		const data = await unsplash.search.getPhotos({
			query: 'star-wars',
			orientation: 'portrait',
			perPage: 30,
		});

		if (!data.response?.results) {
			showToast('error', 'Cannot get API data');
		} else {
			data.response?.results.forEach((item) => fetchArray.push(item));
			shuffleArray(fetchArray);
			addItemsToGameGrid(chosedValue, fetchArray);
		}
	} catch (error) {
		showToast('error', 'Data fetch failure');
	}
}

function shuffleArray(fetchArray: Basic[]) {
	for (let i = 0; i < fetchArray.length; i++) {
		const random = Math.floor(Math.random() * fetchArray.length);
		[fetchArray[i], fetchArray[random]] = [fetchArray[random], fetchArray[i]];
	}
}

function addItemsToGameGrid(chosedValue: number, fetchArray: Basic[]) {
	const selectedImages = fetchArray.slice(0, chosedValue);

	if (selectedImages) {
		selectedImages.forEach((item: Basic, i: number) => {
			const imgItem = document.createElement('img');
			imgItem.classList.add('game__image');
			imgItem.id = `${i++}`;
			const imgSource = item.urls.small;
			imgItem.src = imgSource;

			imgItemsArray.push(imgItem);
			gameGrid.appendChild(imgItem);

			setTimeout(() => {
				imgItem.classList.add('hidden');
			}, 1700);
		});
	} else {
		showToast('error', 'Cannot load images');
	}

	createImgToFind();
}

function createImgToFind() {
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

	if (ATTEMPT_COUNTER >= MAX_ATTEMPTS) {
		showToast('error', 'No further attempts, Try Again');
		return;
	}

	if (clickedImg.classList.contains('game__image')) {
		ATTEMPT_COUNTER++;
		clickedImg.classList.remove('hidden');
		console.log('clicked od the image', clickedImg);

		if (
			(clickedSrcValue && srcToFindValue && idToFind && clickedIdValue) !== null
		) {
			checkMatchAndShowScoreboard(
				clickedSrcValue,
				srcToFindValue,
				idToFind,
				clickedIdValue
			);
		}
	} else {
		showToast('warning', 'You must choose an image');
	}
};

const checkMatchAndShowScoreboard = (
	clickedSrcValue: string | null,
	srcToFindValue: string | null | undefined,
	idToFind: string | null,
	clickedIdValue: string | null
) => {
	if (clickedSrcValue === srcToFindValue || idToFind === clickedIdValue) {
		PLAYER_SCORE++;
		showScoreboard(COMPUTER_SCORE, PLAYER_SCORE, MAX_ATTEMPTS, ATTEMPT_COUNTER);
		console.log('Match');
	} else {
		COMPUTER_SCORE++;
		showScoreboard(COMPUTER_SCORE, PLAYER_SCORE, MAX_ATTEMPTS, ATTEMPT_COUNTER);

		console.log('Try again');
	}
	return;
};

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		validateAndCloseModal();
	});
});

gameSection.addEventListener('click', checkElements);
restartButton.addEventListener('click', () => location.reload());
