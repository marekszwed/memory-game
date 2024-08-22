import { GameLevels, gameLevels } from './_types.ts';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { createApi } from 'unsplash-js';
import showToast from './_helpers.ts';

const unsplash = createApi({
	accessKey: '',
});

const modal = document.querySelector('.dialog') as HTMLDivElement;
const game = document.querySelector('.js-app') as HTMLDivElement;
// const ulContainer = document.querySelector('.js-game') as HTMLUListElement;
const nameInput = document.querySelector('.js-input-name') as HTMLInputElement;
const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;
const gameGrid = document.querySelector('.js-game') as HTMLDivElement;
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
		checkChosedValue();
	} else {
		showToast('warning', 'Please select your difficulty level', {});
	}
};

async function checkChosedValue() {
	const chosenValue = localStorage.getItem('selectedInput') as keyof GameLevels;
	const chosedValue = gameLevels[chosenValue] || gameLevels.easy;

	await fetchData(chosedValue);
	await shuffleArray(imageArray);
	await createFindContainer(imageArray);
	await addItems(chosedValue, imageArray);

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

async function shuffleArray(imageArray: Basic[]) {
	for (let i = 0; i < imageArray.length; i++) {
		const random = Math.floor(Math.random() * imageArray.length);
		[imageArray[i], imageArray[random]] = [imageArray[random], imageArray[i]];
	}
}

async function addItems(chosedValue: number, imageArray: Basic[]) {
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

	return createFindContainer(selectedImages);
}

async function createFindContainer(selectedImages: Array<object>) {
	const findImageSection = imageArray.slice(0, 1);
	const randomImg = Math.floor(Math.random() * selectedImages.length);
	console.log(imgItemsArray);

	findImageSection.forEach((imgItemsArray: Basic) => {
		const findContainer: HTMLDivElement =
			document.querySelector('.js-find-container')!;
		const findTitle: HTMLElement = document.querySelector('.js-find-title')!;
		const imgToFind = document.createElement('img');
		imgToFind.id = imgItemsArray.id[randomImg];
		imgToFind.src = imgItemsArray.urls.small;
		imgToFind.classList.add('image-to-find');
		findContainer.append(imgToFind, findTitle);
	});
}

const checkMatch = (e: Event) => {
	console.log(e.target);
};

game.addEventListener('click', checkMatch);

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		closeModal();
	});
});
