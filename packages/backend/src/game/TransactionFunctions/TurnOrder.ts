import { getCurrentPlayer } from "../../database/controller/gamestate.controller";
import { FullGameStateInclude } from "../../database/controller/includes";
import {
	parseTurnOrder,
	serialiseTurnOrder
} from "../../utils";
import { MoveTransactionFunctionTyped } from "./types";
import { BuildErrorMessage } from "./utils";

export const PickTurnOrder: MoveTransactionFunctionTyped<
	number
> = async (bundle, spot) => {
	const { ctx, gameId, player } = bundle;

	const gameState = await ctx.gameState.findUniqueOrThrow(
		{
			where: { id: gameId },
			include: FullGameStateInclude
		}
	);

	const currentPlayer = getCurrentPlayer(gameState);

	if (currentPlayer === null)
		throw new Error(
			"Current player is null during the pick turn order phase"
		);

	const currentTurnOrder = parseTurnOrder(
		gameState.turnOrder
	);
	if (currentTurnOrder.includes(player)) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter their turn order when it has already been chosen"
			)
		);
	} else if (
		spot >= currentTurnOrder.length ||
		spot < 0
	) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter an invalid turn order spot"
			)
		);
	} else if (currentTurnOrder[spot] !== null) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter a turn order spot that is already taken"
			)
		);
	}

	currentTurnOrder[spot] = player;

	// Will throw an error on failure
	try {
		await ctx.gameState.update({
			where: { id: gameId },
			data: {
				turnOrder: serialiseTurnOrder(
					currentTurnOrder
				)
			}
		});
	} catch (error) {
		throw new Error(
			`Committing turn order update to database failed in lobby #${gameState.id}. Error: ${JSON.stringify(error)} `
		);
	}
};
