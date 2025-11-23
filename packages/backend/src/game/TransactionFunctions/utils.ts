import { TURN_PROGRESS } from "@prisma/client";
import { UnreadyPlayers } from "./ReadyStatus";
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

	await UnreadyPlayers(bundle);
}
