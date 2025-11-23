import { EmployeeId } from "magnate-core/employees/types";
import {
	EmployeeNode,
	IsValidEmployeeTree,
	SerialiseEmployeeTree,
	getEmployeeById,
	parseJsonArray
} from "../../utils";
import {
	MoveTransactionFunctionTyped,
	MoveTransactionFunctionUntyped
} from "./types";
import { BuildErrorMessage } from "./utils";

export const Restructure: MoveTransactionFunctionTyped<
	EmployeeNode
> = async (bundle, newTree) => {
	const { ctx, gameId, player } = bundle;
	const gamePlayer =
		await ctx.gamePlayer.findUniqueOrThrow({
			where: {
				gamePlayerId: {
					gameId: gameId,
					number: player
				}
			}
		});

	const employeeList = parseJsonArray(
		gamePlayer.employees
	) as EmployeeId[];

	if (
		!IsValidEmployeeTree(
			newTree,
			employeeList.map((emp) => getEmployeeById(emp))
		)
	)
		throw new Error(
			BuildErrorMessage(bundle, "set an invalid tree")
		);

	const updated = await ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: gameId,
				number: player
			}
		},
		data: {
			ready: "READY",
			employeeTree: SerialiseEmployeeTree(newTree)
		}
	});
	if (!updated)
		throw new Error(
			`Unable to restructure for player ${player} in lobby #${gameId}`
		);
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
