export * from "./GameState";
export * from "./Moves";
export * from "./actions";
export * from "./events";

export const GameStatuses = [
	"PLACING_FIRST_RESTAURANTS",
	"PLACING_FIRST_RESTAURANTS_WAVE_TWO",
	"SELECTING_BANK_RESERVE",
	// Standard game loop
	"RESTRUCTURING",
	"SELECTING_TURN_ORDER",
	"WORKING_NINE_TO_FIVE",
	"SALARY_PAYOUTS"
];

export type GameStatus = (typeof GameStatuses)[number];
