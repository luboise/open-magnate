import { TURN_PROGRESS } from "@prisma/client";
import { MOVE_TYPE, MoveData } from "../../../shared/Moves";

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
			}
		});
	// TODO: Extract this logic into a separate function
	if (
		gameState.turnProgress !== "SALARY_PAYOUTS" &&
		gameState.turnProgress !== "RESTRUCTURING" &&
		gameState.currentPlayer !== bundle.player
	)
		throw new Error(
			BuildErrorMessage(bundle, "take their turn")
		);

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
			await TransactionFunctions.AdvanceGamestate(
				bundle
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
			await TransactionFunctions.AdvanceGamestate(
				bundle
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

			const allReady =
				await TransactionFunctions.AllPlayersReady(
					bundle
				);

			if (allReady)
				await TransactionFunctions.AdvanceGamestate(
					bundle
				);

			break;
		}
		default:
			throw new Error(
				`Invalid transaction move attempted in lobby #${bundle.gameId}: ${move}`
			);
	}
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

