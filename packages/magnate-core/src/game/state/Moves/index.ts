import { EmployeeNode, GameState } from "@/game";
import { ENTRANCE_CORNER, Position } from "@/game/map/area";
import { RestaurantTile } from "@/game/map/tiles/RestaurantTiles";
import { TurnAction } from "../actions";
import { ExecuteTurn } from "../events/Turns";

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

/// Returns undefined if the move transaction failed
export function applyMoveToGamestate(
	state: GameState,
	playerIndex: number,
	move: Move
): GameState | undefined {
	const currentMove = GameState.nextMove(state);

	if (
		!currentMove ||
		move.moveType != currentMove.moveType
	) {
		return;
	}

	let newState: GameState | undefined = undefined;

	switch (move.moveType) {
		case MoveType.PLACE_RESTAURANT: {
			newState = GameState.placeNewTile(
				state,
				RestaurantTile.create(
					Position(move.x, move.y),
					playerIndex,
					false
				)
			);
			break;
		}
		case MoveType.WORK_EMPLOYEES: {
			return ExecuteTurn(state, playerIndex, move);
		}
		case MoveType.NEGOTIATE_SALARIES: {
			// NegotiateSalaries(bundle, move.employeesToFire);

			break;
		}
		case MoveType.RESTRUCTURE: {
			/*
			TransactionFunctions.Restructure(
				bundle,
				move.tree
			);
			*/

			break;
		}
		case MoveType.SELECT_TURN_ORDER: {
			/*
			TransactionFunctions.PickTurnOrder(
				bundle,
				move.slot
			);
			*/
			break;
		}
		case MoveType.SELECT_BANK_RESERVE: {
			break;
		}
		default:
			break;
	}

	if (newState) {
		return GameState.advance(newState);
	}

	// TransactionFunctions.ReadyPlayer(bundle);
	// TransactionFunctions.NewEvent(bundle);

	return newState;
}
