import { READY_STATUS } from "@prisma/client";
import { parseJsonArray } from "../../utils";
import { MoveTransactionFunctionTyped } from "./types";

export const NegotiateSalaries: MoveTransactionFunctionTyped<
	number[]
> = async (bundle, employeesToFire: number[]) => {
	const { ctx, gameId, player } = bundle;

	const existingPlayer =
		await ctx.gamePlayer.findUniqueOrThrow({
			where: {
				gamePlayerId: {
					gameId: gameId,
					number: player
				}
			}
		});

	const gamePlayer = await ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: gameId,
				number: player
			}
		},
		data: {
			ready: READY_STATUS.READY,
			employees: [
				...parseJsonArray(
					existingPlayer.employees
				).filter(
					(_, index) =>
						!employeesToFire.includes(index)
				)
			]
		}
	});

	if (!gamePlayer)
		throw new Error(
			"No game player was able to be updated."
		);
};
