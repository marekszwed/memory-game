const scoreboard = document.querySelector('.js-scoreboard') as HTMLDivElement;
const playerResult = document.querySelector(
	'.js-player-score'
) as HTMLParagraphElement;
const computerResult = document.querySelector(
	'.js-computer-score'
) as HTMLParagraphElement;

export const showScoreboard = (COMPUTER_SCORE: number, PLAYER_SCORE: number, MAX_ATTEMPTS: number, ATTEMPT_COUNTER: number) => {
	playerResult.textContent = String(PLAYER_SCORE);
	computerResult.textContent = String(COMPUTER_SCORE);
	

	if(ATTEMPT_COUNTER == MAX_ATTEMPTS) {
		scoreboard.classList.add('show');
	}
};


