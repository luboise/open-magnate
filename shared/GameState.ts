// export type GameState = {
// 	turnProgress: TurnProgress;
// 	currentTurn: number;
// 	currentPlayer: number;
// 	players: Array<Player>;
// 	mapPieces: Array<MapPieceData>;
// 	houses: Array<House>;
// 	turnOrder: Array<number> | null;
// };

import { EMPLOYEE_NAME } from "./EmployeeNames";

// export interface GameCreationParams {
// 	players: Player[];
// }

export const MAX_PLAYER_COUNT = 5;

interface BaseGameAction {
	player: number;
	type: string;
}

interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	employeeIndex: number;
	recruiting: EMPLOYEE_NAME;
}

export type GameAction = RecruitAction;
