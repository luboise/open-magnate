import { TURN_PROGRESS } from "@prisma/client";
import { MOVE_TYPE, MoveData } from "../../../shared/Moves";

import {
	FullGameStateInclude,
	getCurrentPlayer
} from "../database/controller/gamestate.controller";
import TransactionFunctions, {
	BuildErrorMessage,
	TransactionBundle
} from "./TransactionFunctions";

export async function TransactMove(
	bundle: TransactionBundle,
	move: MoveData
): Promise<void> {
	const gameState =
		await bundle.ctx.gameState.findUniqueOrThrow({
			where: {
				id: bundle.gameId
			},
			include: FullGameStateInclude
		});
	const currentPlayer = getCurrentPlayer(gameState);
	if (
		currentPlayer !== null &&
		bundle.player !== currentPlayer
	)
		throw new Error(
			BuildErrorMessage(bundle, "take their turn")
		);

	let doReadyCheck = false;

	// TODO: Add logic for each move here
	switch (move.MoveType) {
		case MOVE_TYPE.PLACE_RESTAURANT: {
			if (
				gameState.turnProgress !==
				"RESTAURANT_PLACEMENT"
			)
				throw new Error(
					BuildErrorMessage(
						bundle,
						`place a restaurant during the ${gameState.turnProgress} stage`
					)
				);

			await TransactionFunctions.AddNewRestaurant(
				bundle,
				move
			);

			break;
		}
		case MOVE_TYPE.TAKE_TURN: {
			if (gameState.turnProgress !== "USE_EMPLOYEES")
				throw new Error(
					BuildErrorMessage(
						bundle,
						` take a turn during the ${gameState.turnProgress} stage`
					)
				);

			await TransactionFunctions.ExecuteTurn(
				bundle,
				move.actions
			);

			break;
		}
		case MOVE_TYPE.NEGOTIATE_SALARIES: {
			if (gameState.turnProgress !== "SALARY_PAYOUTS")
				throw new Error(
					BuildErrorMessage(
						bundle,
						`negotiate salaries during the ${gameState.turnProgress} stage`
					)
				);

			await TransactionFunctions.NegotiateSalaries(
				bundle,
				move.employeesToFire
			);

			break;
		}
		case MOVE_TYPE.RESTRUCTURE: {
			if (gameState.turnProgress !== "RESTRUCTURING")
				throw new Error(
					BuildErrorMessage(
						bundle,
						`restructure during the ${gameState.turnProgress} stage`
					)
				);

			await TransactionFunctions.Restructure(
				bundle,
				move.tree
			);

			break;
		}
		case MOVE_TYPE.PICK_TURN_ORDER: {
			if (
				gameState.turnProgress !==
				"TURN_ORDER_SELECTION"
			)
				throw new Error(
					`pick turn order during the ${gameState.turnProgress} stage`
				);

			await TransactionFunctions.PickTurnOrder(
				bundle,
				move.slot
			);
		}
		default:
			throw new Error(
				`Invalid transaction move attempted in lobby #${bundle.gameId}: ${move}`
			);
	}

	await TransactionFunctions.ReadyPlayer(bundle);
	await TransactionFunctions.ValidateTurnProgress(bundle);
}

export function GetNextTurnPhase(
	currentTurnPhase: TURN_PROGRESS
): TURN_PROGRESS {
	switch (currentTurnPhase) {
		case "RESTRUCTURING": {
			return "TURN_ORDER_SELECTION";
		}
		case "TURN_ORDER_SELECTION": {
			return "USE_EMPLOYEES";
		}
		case "USE_EMPLOYEES": {
			return "SALARY_PAYOUTS";
		}
		// TODO: Fix this to run cleanup
		case "SALARY_PAYOUTS": {
			return "RESTRUCTURING";
		}
		case "MARKETING_CAMPAIGNS": {
			return "CLEAN_UP";
		}
		case "CLEAN_UP": {
			return "RESTRUCTURING";
		}
		case "RESTAURANT_PLACEMENT": {
			return "USE_EMPLOYEES";
		}
		default: {
			throw new Error(
				`Invalid turn phase: ${currentTurnPhase}`
			);
		}
	}
}

