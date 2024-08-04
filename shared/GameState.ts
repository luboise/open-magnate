// export type GameState = {
// 	turnProgress: TurnProgress;
// 	currentTurn: number;
// 	currentPlayer: number;
// 	players: Array<Player>;
// 	mapPieces: Array<MapPieceData>;
// 	houses: Array<House>;
// 	turnOrder: Array<number> | null;
// };

import { Position } from "../backend/src/dataViews";
import { EMPLOYEE_ID } from "./EmployeeIDs";

// export interface GameCreationParams {
// 	players: Player[];
// }

export const MAX_PLAYER_COUNT = 5;

interface BaseGameAction {
	player: number;
	employeeIndex: number;
	type: string;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EMPLOYEE_ID;
}

export interface MarketingAction extends BaseGameAction {
	type: "Marketing";
	marketingTilePlaced: number;
	pos: Position;
	rotated: boolean;
}

export type TurnAction = RecruitAction;

export const BASE_SALARY = 5;

