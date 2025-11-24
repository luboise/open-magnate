import { READY_STATUS } from "@prisma/client";
import { MoveTransactionFunctionUntyped } from "./types";
import { BuildErrorMessage } from "./utils";

export const AllPlayersReady: MoveTransactionFunctionUntyped =
	async (bundle): Promise<boolean> => {
		const gameState =
			await bundle.ctx.gameState.findFirstOrThrow({
				where: {
					id: bundle.gameId
				},
				include: {
					players: true
				}
			});

		return gameState.players.every(
			(player) => player.ready === READY_STATUS.READY
		);
	};

export const UnreadyPlayers: MoveTransactionFunctionUntyped =
	async (bundle): Promise<void> => {
		const { ctx, gameId } = bundle;

		const updated = await ctx.gamePlayer.updateMany({
			where: {
				gameId: gameId
			},
			data: {
				ready: READY_STATUS.NOT_READY
			}
		});

		if (!updated.count)
			throw new Error("Unable to unready players.");
	};

export const ReadyPlayer: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId, player } = bundle;

		const updated = await ctx.gamePlayer.update({
			where: {
				gamePlayerId: {
					gameId: gameId,
					number: player
				}
			},
			data: {
				ready: READY_STATUS.READY
			}
		});

		if (!updated)
			throw new Error(
				BuildErrorMessage(
					bundle,
					"could not be readied"
				)
			);
	};
