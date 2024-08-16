import { GameLevels, gameLevels } from './_types.ts';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { createApi } from 'unsplash-js';
import showToast from './_helpers.ts';

const unsplash = createApi({
	accessKey: 'G-utIVXOrdr5h7bKSisjUpJijKPTdCh98zklBpzMCNk',
});

const modal = document.querySelector('.dialog') as HTMLDivElement;
const game = document.querySelector('.js-app') as HTMLDivElement;
const ulContainer = document.querySelector('.js-game') as HTMLUListElement;
const nameInput = document.querySelector('.js-input-name') as HTMLInputElement;

const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;
// Buttons
const playButton = document.querySelector(
	'.js-play-button'
) as HTMLButtonElement;
const restartButton = document.querySelector(
	'.js-restart-game'
) as HTMLButtonElement;
// Hidden class
const hiddenClass = 'hidden';

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
	console.log(chosedValue);

	await fetchData(chosedValue);
	await shuffleArray(imageArray);
	await createFindContainer(imageArray);
	await addItems(chosedValue, imageArray);
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
		const random = Math.floor(Math.random() * (i + 1));
		[imageArray[i], imageArray[random]] = [imageArray[random], imageArray[i]];
	}

	createFindContainer(imageArray);
}

async function createFindContainer(imageArray: Basic[]) {
	const findImageSection = imageArray.slice(0, 2);
	findImageSection.forEach((findImage: Basic) => {
		const findContainer: HTMLDivElement =
			document.querySelector('.js-find-container')!;
		const findTitle: HTMLElement = document.querySelector('.js-find-title')!;
		const imgToFind = document.createElement('img');

		console.log(findImage);

		imgToFind.setAttribute('src', findImage.urls.small);

		imgToFind.classList.add('image-to-find');

		findContainer.append(findTitle, imgToFind);
	});
}

async function addItems(chosedValue: number, imageArray: Basic[]) {
	const selectedImages = imageArray.slice(0, chosedValue);

	if (selectedImages) {
		selectedImages.forEach((item: Basic) => {
			const liItem: HTMLLIElement = document.createElement('li');
			const blankItem: HTMLElement = document.createElement('div');
			const imgItem = document.createElement('img');
			const imgSource = item.urls.small;

			imgItem.src = imgSource;
			liItem.append(blankItem, imgItem);
			ulContainer.appendChild(liItem);
		});
		checkMatch();
	} else {
		showToast('error', 'Cannot load images');
	}
}

const checkMatch = () => {};

document.addEventListener('DOMContentLoaded', () => {
	playButton.addEventListener('click', (e) => {
		e.preventDefault();
		closeModal();
	});
});
