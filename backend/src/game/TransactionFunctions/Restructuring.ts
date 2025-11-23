import { EMPLOYEE_ID } from "../../../../shared/employees/types";
import {
	Employee,
	EmployeeNode,
	IsValidEmployeeTree,
	SerialiseEmployeeTree,
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
	) as EMPLOYEE_ID[];

	if (
		!IsValidEmployeeTree(
			newTree,
			employeeList.map((emp) => Employee.ById(emp))
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
