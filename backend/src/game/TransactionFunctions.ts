import {
	Prisma,
	READY_STATUS,
	TURN_PROGRESS
} from "@prisma/client";
import {
	EmployeeNode,
	EmployeesById,
	IsValidEmployeeTree,
	SerialiseEmployeeTree,
	TurnAction
} from "../../../shared";
import { EMPLOYEE_ID } from "../../../shared/EmployeeIDs";
import { MovePlaceRestaurant } from "../../../shared/Moves";
import {
	FullGameStateInclude,
	getCurrentPlayer
} from "../database/controller/gamestate.controller";
import { parseJsonArray } from "../utils";
import { GetNextTurnPhase } from "./HandleMove";

export interface TransactionBundle {
	ctx: Prisma.TransactionClient;
	gameId: number;
	player: number;
}

const AddNewRestaurant: MoveTransactionFunction = async (
	bundle,
	details: MovePlaceRestaurant
) => {
	{
		// TODO: Add validation
		const updated =
			await bundle.ctx.gamePlayerRestaurant.create({
				data: {
					gameId: bundle.gameId,
					playerNumber: bundle.player,

					x: details.x,
					y: details.y,
					entrance: details.entrance
				}
			});

		return Boolean(updated);
	}
};

const ExecuteTurn: MoveTransactionFunctionTyped<
	TurnAction[]
> = async (bundle, turn: TurnAction[]) => {
	const gamePlayer =
		await bundle.ctx.gamePlayer.findUniqueOrThrow({
			where: {
				gamePlayerId: {
					gameId: bundle.gameId,
					number: bundle.player
				}
			}
		});

	// TODO: Add validation for valid recruiting
	const newRecruits: EMPLOYEE_ID[] = [];

	for (const turnAction of turn) {
		if (turnAction.type === "RECRUIT") {
			newRecruits.push(turnAction.recruiting);
		}
	}

	// TODO: Fix recruited employees not updating in database (add unit tests for the backend)
	await bundle.ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: bundle.gameId,
				number: bundle.player
			}
		},
		data: {
			employees: [
				...parseJsonArray(gamePlayer.employees),
				...newRecruits
			]
		}
	});
};

const NegotiateSalaries: MoveTransactionFunctionTyped<
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

const HandleEndOfRound: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx } = bundle;

		const gameState =
			await ctx.gameState.findUniqueOrThrow({
				where: {
					id: bundle.gameId
				}
			});

		if (gameState.turnProgress !== "SALARY_PAYOUTS")
			throw new Error(
				`Attempted to handle end of round for a game that is not in the salary stage in lobby #${gameState.id}`
			);

		// TODO: Add logic here for marketing campaigns and other post round actions
		const updated = await ctx.gameState.update({
			where: {
				id: gameState.id
			},
			data: {
				currentTurn: gameState.currentTurn + 1,
				turnProgress: "RESTRUCTURING"
			}
		});

		if (!updated)
			throw new Error("Unable to update game state.");
	};

const UnreadyPlayers: MoveTransactionFunctionUntyped =
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

async function setTurnProgress(
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

	const updatedPlayers = await ctx.gamePlayer.updateMany({
		where: {
			gameId: gameId
		},
		data: {
			ready: READY_STATUS.NOT_READY
		}
	});

	if (!updatedPlayers)
		throw new Error(
			"Unable to update the ready status of the players in the lobby"
		);
}

const ValidateTurnProgress: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId } = bundle;

		const gameState =
			await ctx.gameState.findFirstOrThrow({
				where: {
					id: gameId
				},
				include: FullGameStateInclude
			});

		const currentPlayer = getCurrentPlayer(gameState);
		if (
			currentPlayer === null &&
			(await AllPlayersReady(bundle))
		) {
			await setTurnProgress(
				bundle,
				GetNextTurnPhase(gameState.turnProgress)
			);
			console.log(
				`Successfully advanced turn in game ${gameState.id}`
			);
			return;
		}
	};

const ReadyPlayer: MoveTransactionFunctionUntyped = async (
	bundle
) => {
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

const AllPlayersReady: MoveTransactionFunctionUntyped =
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

const Restructure: MoveTransactionFunctionTyped<
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

type MoveTransactionFunctionUntyped = (
	bundle: TransactionBundle
) => Promise<void | boolean>;

type MoveTransactionFunctionTyped<T> = (
	bundle: TransactionBundle,
	details: T
) => Promise<void | boolean>;

type MoveTransactionFunction =
	| MoveTransactionFunctionUntyped
	| MoveTransactionFunctionTyped<any>;

export const BuildErrorMessage = (
	bundle: TransactionBundle,
	msg: string
) =>
	`Player ${bundle.player} attempted to ${msg.trim()} in lobby #${bundle.gameId}`;

export default {
	AddNewRestaurant,
	AllPlayersReady,
	ExecuteTurn,
	NegotiateSalaries,
	HandleEndOfRound,
	UnreadyPlayers,
	ValidateTurnProgress,
	Restructure,
	ReadyPlayer
};

