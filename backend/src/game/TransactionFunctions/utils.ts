import {
	READY_STATUS,
	TURN_PROGRESS
} from "@prisma/client";
import { FullGameStateInclude } from "../../database/controller/includes";
import { GetNextTurnPhase } from "../HandleMove";
import { HandleEndOfRound } from "./Cleanup";
import { HandleDinnertime } from "./Dinnertime";
import {
	MoveTransactionFunctionUntyped,
	TransactionBundle
} from "./types";

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
export const BackupTurnOrder: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId } = bundle;

		const game = await ctx.gameState.findUniqueOrThrow({
			where: { id: gameId }
		});

		if (
			!(await ctx.gameState.update({
				where: { id: gameId },
				data: {
					oldTurnOrder: game.turnOrder,
					turnOrder: "X".repeat(game.playerCount)
				}
			}))
		)
			throw new Error(
				"Unable to update currentTurnOrder"
			);
	};
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

export const BuildErrorMessage = (
	bundle: TransactionBundle,
	msg: string
) =>
	`Player ${bundle.player} attempted to ${msg.trim()} in lobby #${bundle.gameId}`;
