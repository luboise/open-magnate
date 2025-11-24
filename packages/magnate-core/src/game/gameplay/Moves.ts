import { ENTRANCE_CORNER } from "@/game/map/area";
import { EmployeeNode } from "../Employee";
import { TurnAction } from "./actions";

export enum MoveType

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
	moveType: MoveType.TAKE_TURN;
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
	moveType: MoveType.PICK_TURN_ORDER;
	slot: number;
}

export type Move =
	| MovePlaceRestaurant
	| MoveTakeTurn
	| MoveNegotiateSalaries
	| MoveRestructure
	| MoveSelectBankReserve
	| MovePickTurnOrder;
