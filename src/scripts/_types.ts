export interface GameLevels {
	easy: number;
	medium: number;
	hard: number;
}

export const gameLevels: GameLevels = {
	easy: 6,
	medium: 12,
	hard: 18,
};

export interface ScoreBoardResults {
	attemptCounter: number;
	maxAttempts: number;
	playerScore: number;
	computerScore: number;
}

export const scoreBoardResults: ScoreBoardResults = {
	attemptCounter: 0,
	maxAttempts: 2,
	playerScore: 0,
	computerScore: 0,
};

export interface EventElementsValues {
	clickedSrcValue: string | null;
	srcToFindValue?: string | null;
	idToFind: string | null;
	clickedIdValue: string | null;
}

export const eventElementsValues: EventElementsValues = {
	clickedSrcValue: null,
	srcToFindValue: null,
	idToFind: null,
	clickedIdValue: null,
};

export interface Delays {
	8: number;
	12: number;
	18: number;
}

export const delays: Delays = {
	8: 1200,
	12: 2000,
	18: 2500,
};
