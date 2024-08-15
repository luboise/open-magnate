// export type GameState = {
// 	turnProgress: TurnProgress;
// 	currentTurn: number;
// 	currentPlayer: number;
// 	players: Array<Player>;
// 	mapPieces: Array<MapPieceData>;
// 	houses: Array<House>;
// 	turnOrder: Array<number> | null;
// };

import { DEMAND_TYPE } from "../backend/src/dataViews";
import { EMPLOYEE_ID } from "./EmployeeIDs";
import { MarketingTile } from "./MapTiles";

// export interface GameCreationParams {
// 	players: Player[];
// }

export const MAX_PLAYER_COUNT = 5;

interface BaseGameAction {
	type: string;
	employeeIndex: number;
	player: number;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EMPLOYEE_ID;
}

export interface MarketingAction extends BaseGameAction {
	type: "MARKETING";
	tile: MarketingTile;
}

export interface DemandAction extends BaseGameAction {
	type: "GET_DEMAND";
	demand: DEMAND_TYPE;
	amount: number;
}

export type TurnAction =
	| RecruitAction
	| MarketingAction
	| DemandAction;

export const BASE_SALARY = 5;
