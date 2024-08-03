import { ENTRANCE_CORNER } from "../backend/src/dataViews";
import { EmployeeNode } from "./EmployeeStructure";
import { TurnAction } from "./GameState";

export enum MOVE_TYPE {
	PLACE_RESTAURANT = "PLACE_RESTAURANT",
	TAKE_TURN = "TAKE_TURN",
	NEGOTIATE_SALARIES = "NEGOTIATE_SALARIES",
	RESTRUCTURE = "RESTRUCTURE"
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

export interface MoveNegotiateSalaries
	extends BaseMoveData {
	MoveType: MOVE_TYPE.NEGOTIATE_SALARIES;
	employeesToFire: number[];
}

export interface MoveRestructure extends BaseMoveData {
	MoveType: MOVE_TYPE.RESTRUCTURE;
	tree: EmployeeNode;
}

export type MoveData =
	| MovePlaceRestaurant
	| MoveTakeTurn
	| MoveNegotiateSalaries
	| MoveRestructure;

