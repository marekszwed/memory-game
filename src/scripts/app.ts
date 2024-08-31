import { showScoreboard } from './_scoreboard.ts';
import {
	eventElementsValues,
	GameLevels,
	gameLevels,
	scoreBoardResults,
} from './_types.ts';
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

const imgItemsArray: Array<HTMLImageElement> = [];

const fetchArray: Basic[] = [];

const validateAndCloseModal = () => {
	if (nameInput.value.trim()) {
		modal.classList.add('hidden');
		gameSection.classList.remove('hidden');
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

	console.log(selectedImages);

	if (selectedImages) {
		selectedImages.forEach((item: Basic, i: number) => {
			const imgItem = document.createElement('img');
			imgItem.classList.add('game__image');
			imgItem.id = `${i++}`;
			const imgSource = item.urls.small;
			imgItem.src = imgSource;

			imgItemsArray.push(imgItem);
			gameGrid.appendChild(imgItem);

			let delay = 0;

			switch (chosedValue) {
				case 8:
					delay = 1200;
					break;
				case 12:
					delay = 2000;
					break;
				case 18:
					delay = 2500;
					break;
				default:
					delay = 1200;
			}

			setTimeout(() => {
				imgItem.classList.add('turn-on-display');
			}, delay);
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

	findContainer.classList.add('show');

	imgToFind.id = originalImage.id;
	imgToFind.src = originalImage.src;
	imgToFind.classList.add('image-to-find');
	findContainer.append(imgToFind, findTitle);
}

const checkElements = (event: Event) => {
	const clickedImg = event.target as HTMLElement;

	const imgFind = document.querySelector('.image-to-find') as HTMLImageElement;
	eventElementsValues.clickedSrcValue = clickedImg.getAttribute('src');
	eventElementsValues.srcToFindValue = imgFind.getAttribute('src');
	eventElementsValues.clickedIdValue = clickedImg.getAttribute('id');
	eventElementsValues.idToFind = imgFind.getAttribute('id');

	const { clickedSrcValue, srcToFindValue, idToFind, clickedIdValue } =
		eventElementsValues;

	if (scoreBoardResults.attemptCounter >= scoreBoardResults.maxAttempts) {
		showToast('error', 'No further attempts, Try Again');
		return;
	}

	if (clickedImg.classList.contains('game__image')) {
		scoreBoardResults.attemptCounter++;
		clickedImg.classList.remove('turn-on-display');
		console.log('clicked od the image', clickedImg);

		if (
			(clickedSrcValue && srcToFindValue && idToFind && clickedIdValue) !== null
		) {
			checkMatchAndShowScoreboard();
		}
	} else {
		showToast('warning', 'You must choose an image');
	}
};

const checkMatchAndShowScoreboard = () => {
	const { clickedSrcValue, srcToFindValue, idToFind, clickedIdValue } =
		eventElementsValues;
	if (clickedSrcValue === srcToFindValue || idToFind === clickedIdValue) {
		scoreBoardResults.playerScore++;
		showScoreboard();
		console.log('Match');
	} else {
		scoreBoardResults.computerScore++;
		showScoreboard();

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
