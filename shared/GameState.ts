export enum TurnProgress {
	SETTING_UP = "setting_up",
	RESTAURANT_PLACEMENT = "restaurant_placement",
	RESTRUCTURING = "restructuring",
	TURN_ORDER_SELECTION = "turn_order_selection",
	USE_EMPLOYEES = "use_employees",
	SALARY_PAYOUTS = "salary_payouts",
	MARKETING_CAMPAIGNS = "marketing_campaigns",
	CLEAN_UP = "clean_up"
}

// export type GameState = {
// 	turnProgress: TurnProgress;
// 	currentTurn: number;
// 	currentPlayer: number;
// 	players: Array<Player>;
// 	mapPieces: Array<MapPieceData>;
// 	houses: Array<House>;
// 	turnOrder: Array<number> | null;
// };

// export interface GameCreationParams {
// 	players: Player[];
// }

export const MAX_PLAYER_COUNT = 5;
