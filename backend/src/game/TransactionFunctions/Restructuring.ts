import {
	EMPLOYEE_ID,
	EmployeeNode,
	EmployeesById,
	IsValidEmployeeTree,
	SerialiseEmployeeTree,
	parseJsonArray
} from "../../utils";
import { MoveTransactionFunctionTyped } from "./types";
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
			employeeList.map((emp) => EmployeesById[emp])
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
