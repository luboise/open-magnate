import { FullGameStateInclude } from "../../database/controller/includes";
import { GetNextTurnPhase } from "../HandleMove";
import { HandleEndOfRound } from "./Cleanup";
import { HandleDinnertime } from "./Dinnertime";
import { AllPlayersReady } from "./ReadyStatus";
import { BackupTurnOrder } from "./Restructuring";
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
			await HandleEndOfPhase(bundle);
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

const HandleEndOfPhase: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const turnProgress = (
			await bundle.ctx.gameState.findFirstOrThrow({
				where: { id: bundle.gameId }
			})
		).turnProgress;

		if (turnProgress === "RESTRUCTURING") {
			await BackupTurnOrder(bundle);
		} else if (turnProgress === "USE_EMPLOYEES") {
			await HandleDinnertime(bundle);
		} else if (turnProgress === "SALARY_PAYOUTS") {
			await HandleEndOfRound(bundle);
		}
	};
