import { ENTRANCE_CORNER } from "@/game/map/area";
import { EmployeeNode } from "../Employee";
import { TurnAction } from "./actions";

export enum MoveType {
	SELECT_BANK_RESERVE = "SELECT_BANK_RESERVE",
	PLACE_RESTAURANT = "PLACE_RESTAURANT",
	WORK_EMPLOYEES = "TAKE_TURN",
	NEGOTIATE_SALARIES = "NEGOTIATE_SALARIES",
	RESTRUCTURE = "RESTRUCTURE",
	SELECT_TURN_ORDER = "PICK_TURN_ORDER"
}

interface BaseMove {
	moveType: MoveType;
}

export interface MoveSelectBankReserve extends BaseMove {
	moveType: MoveType.SELECT_BANK_RESERVE;
	reserveAmount: number;
}

export interface MovePlaceRestaurant extends BaseMove {
	moveType: MoveType.PLACE_RESTAURANT;
	x: number;
	y: number;
	entrance: ENTRANCE_CORNER;
}

export interface MoveTakeTurn extends BaseMove {
	moveType: MoveType.WORK_EMPLOYEES;
	actions: TurnAction[];
}

export interface MoveNegotiateSalaries extends BaseMove {
	moveType: MoveType.NEGOTIATE_SALARIES;
	employeesToFire: number[];
}

export interface MoveRestructure extends BaseMove {
	moveType: MoveType.RESTRUCTURE;
	tree: EmployeeNode;
}

export interface MovePickTurnOrder extends BaseMove {
	moveType: MoveType.SELECT_TURN_ORDER;
	slot: number;
}

export type Move =
	| MovePlaceRestaurant
	| MoveTakeTurn
	| MoveNegotiateSalaries
	| MoveRestructure
	| MoveSelectBankReserve
	| MovePickTurnOrder;
