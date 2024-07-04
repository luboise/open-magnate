import { ENTRANCE_CORNER } from "../backend/src/dataViews";
export enum MOVE_TYPE {
	PLACE_RESTAURANT = "PLACE_RESTAURANT"
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

export type MoveData = MovePlaceRestaurant;
