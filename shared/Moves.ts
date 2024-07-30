import { ENTRANCE_CORNER } from "../backend/src/dataViews";
import { TurnAction } from "./GameState";
export enum MOVE_TYPE {
	PLACE_RESTAURANT = "PLACE_RESTAURANT",
	TAKE_TURN = "TAKE_TURN"
}

interface BaseMoveData {
	MoveType: MOVE_TYPE;
}

export interface MovePlaceRestaurant extends BaseMoveData {
	MoveType: MOVE_TYPE.PLACE_RESTAURANT;
	x: number;
	y: number;
	entrance: ENTRANCE_CORNER;
}

export interface MoveTakeTurn extends BaseMoveData {
	MoveType: MOVE_TYPE.TAKE_TURN;
	actions: TurnAction[];
}

export type MoveData = MovePlaceRestaurant | MoveTakeTurn;
