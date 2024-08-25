const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;
const playerResult = document.querySelector(
	'.js-player-score'
) as HTMLParagraphElement;
const computerResult = document.querySelector(
	'.js-computer-score'
) as HTMLParagraphElement;

export const showScoreboard = (computerScore: number, playerScore: number) => {
	playerResult.textContent = `${playerScore}`;
	computerResult.textContent = `${computerScore}`;
	scoreboard.classList.add('show');
};

export const hideScoreboard = () => {
	scoreboard.classList.remove('show');
};
