import {
	BANK_RESERVE_AMOUNTS,
	Employee,
	EmployeeNode
} from "../..";
import { ENTRANCE_CORNER, Position } from "../../map/area";
import { RestaurantTile } from "../../map/tiles/RestaurantTile";
import { TurnAction } from "../actions";
import { ExecuteTurn } from "../events/Turns";
import { GameState } from "../GameState";

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
	actions: Record<number, TurnAction[]>;
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
): GameState | string {
	const nextMove = GameState.nextMove(state);

	if (nextMove === undefined) {
		return "No next move available.";
	} else if (move.moveType != nextMove.moveType) {
		return `Move type mismatch. Expected ${nextMove.moveType}, got ${move.moveType}`;
	}

	let newState: GameState | string | undefined =
		undefined;
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
			newState = ExecuteTurn(
				state,
				playerIndex,
				move
			);
			break;
		}
		case MoveType.NEGOTIATE_SALARIES: {
			newState = GameState.clone(state);

			const player = newState.players[playerIndex];

			if (move.employeesToFire.length >= 0) {
				const badIndex = move.employeesToFire.find(
					(v) =>
						v < 0 ||
						v >= player.employees.length
				);

				// If any of the indices are out of range
				if (badIndex !== undefined) {
					return `Unable to negotiate salaries: Employee with index ${badIndex} is out of range of employee list with size ${player.employees.length}.`;
				}

				// Sort in reverse order so we can safely remove elements
				move.employeesToFire.sort((a, b) => b - a);

				player.employees = player.employees.filter(
					(_, i) =>
						!move.employeesToFire.includes(i)
				);
			}

			const salary = Employee.getSalaryCost(
				player.employees
			);

			if (salary > player.money) {
				return "Not enough money to pay employees for the next year.";
			}

			player.money -= salary;

			break;
		}
		case MoveType.RESTRUCTURE: {
			newState = GameState.clone(state);
			const player = newState.players[playerIndex];

			if (
				!EmployeeNode.isValidTree(
					move.tree,
					player.employees
				)
			) {
				return "Invalid tree for player.";
			}

			player.tree = move.tree;

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
			const amountIndex =
				BANK_RESERVE_AMOUNTS.findIndex(
					(v) => v === move.reserveAmount
				);
			if (amountIndex === -1) {
				return (
					"Invalid reserve amount: " +
					move.reserveAmount
				);
			}

			newState = GameState.clone(state);
			newState.players[
				playerIndex
			].bankReserveAmount =
				BANK_RESERVE_AMOUNTS[amountIndex];
			break;
		}
		default:
			break;
	}

	if (newState === undefined) {
		return "Failed to apply move to state: Unknown error.";
	} else if (typeof newState === "string") {
		return "Failed to apply move to state: " + newState;
	}

	// TransactionFunctions.ReadyPlayer(bundle);
	// TransactionFunctions.NewEvent(bundle);

	newState = GameState.advance(newState, playerIndex);
	if (typeof newState === "string") {
		return (
			"Failed to advance game state after applying move: " +
			newState
		);
	}

	return newState;
}
