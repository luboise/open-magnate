import { House } from "./House";
import { MapTileData } from "./MapTileData";
import { Player } from "./Player";

export enum TurnProgress {
	RESTAURANT_PLACEMENT = "restaurant_placement",
	RESTRUCTURING = "restructuring",
	TURN_ORDER_SELECTION = "turn_order_selection",
	USE_EMPLOYEES = "use_employees",
	SALARY_PAYOUTS = "salary_payouts",
	MARKETING_CAMPAIGNS = "marketing_campaigns",
	CLEAN_UP = "clean_up"
}

export type GameState = {
	turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number;
	players: Array<Player>;
	mapTiles: Array<MapTileData>;
	houses: Array<House>;
	turnOrder: Array<number> | null;
};

export interface GameCreationParams {
	players: Player[];
}
