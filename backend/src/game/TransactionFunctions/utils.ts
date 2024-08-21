import { TURN_PROGRESS } from "@prisma/client";
import { HandleEndOfRound } from "./Cleanup";
import { HandleDinnertime } from "./Dinnertime";
import { UnreadyPlayers } from "./ReadyStatus";
import { BackupTurnOrder } from "./Restructuring";
import { TransactionBundle } from "./types";

export const BuildErrorMessage = (
	bundle: TransactionBundle,
	msg: string
) =>
	`Player ${bundle.player} attempted to ${msg.trim()} in lobby #${bundle.gameId}`;

export async function setTurnProgress(
	bundle: TransactionBundle,

	nextTurnProgress: TURN_PROGRESS
) {
	const { ctx, gameId } = bundle;
	const updatedTurnProgress = await ctx.gameState.update({
		where: {
			id: gameId
		},
		data: {
			turnProgress: nextTurnProgress
		}
	});
	if (!updatedTurnProgress)
		throw new Error(
			"Unable to update nextTurnProgress"
		);

	if (nextTurnProgress === "TURN_ORDER_SELECTION") {
		await BackupTurnOrder(bundle);
	} else if (nextTurnProgress === "SALARY_PAYOUTS") {
		await HandleDinnertime(bundle);
	} else if (nextTurnProgress === "CLEAN_UP")
		await HandleEndOfRound(bundle);

	await UnreadyPlayers(bundle);
}
