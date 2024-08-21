import { FullGameStateInclude } from "../../database/controller/includes";
import { GetNextTurnPhase } from "../HandleMove";
import { AllPlayersReady } from "./ReadyStatus";
import { MoveTransactionFunctionUntyped } from "./types";
import { setTurnProgress } from "./utils";

export const ValidateTurnProgress: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId } = bundle;

		const gameState =
			await ctx.gameState.findFirstOrThrow({
				where: {
					id: gameId
				},
				include: FullGameStateInclude
			});

		if (await AllPlayersReady(bundle)) {
			await setTurnProgress(
				bundle,
				GetNextTurnPhase(gameState.turnProgress)
			);
			console.log(
				`Successfully advanced turn in game ${gameState.id}`
			);
		} else {
			console.log(
				`Not all players are ready in game ${gameState.id}`
			);
		}
	};
