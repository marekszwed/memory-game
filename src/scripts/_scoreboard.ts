import { scoreBoardResults } from './_types';

const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;
const playerResult = document.querySelector(
	'.js-player-score'
) as HTMLParagraphElement;
const computerResult = document.querySelector(
	'.js-computer-score'
) as HTMLParagraphElement;

export const showScoreboard = () => {
	const restartButton = document.querySelector(
		'.js-restart-game'
	) as HTMLButtonElement;
	const { playerScore, computerScore, maxAttempts, attemptCounter } =
		scoreBoardResults;

	playerResult.textContent = `${playerScore}`;
	computerResult.textContent = `${computerScore}`;

	if (playerScore > computerScore && attemptCounter === maxAttempts) {
		scoreboard.style.display = 'flex';
		restartButton.textContent = 'You Won, play again';
	} else if (playerScore > computerScore) {
		scoreboard.style.display = 'flex';
		restartButton.textContent = 'You Won, play again';
	} else if (computerScore > playerScore && attemptCounter === maxAttempts) {
		scoreboard.style.display = 'flex';
		restartButton.textContent = 'You Lose, try again';
	} else if (computerScore == playerScore && attemptCounter === maxAttempts) {
		scoreboard.style.display = 'flex';
		restartButton.textContent = 'Draw, try again';
	}
};
