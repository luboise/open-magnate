import {
	Prisma,
	READY_STATUS,
	TURN_PROGRESS
} from "@prisma/client";
import {
	Area,
	EmployeeNode,
	EmployeesById,
	FoodType,
	HouseView,
	IsValidEmployeeTree,
	SerialiseEmployeeTree,
	TurnAction
} from "../../../shared";
import { EMPLOYEE_ID } from "../../../shared/EmployeeIDs";
import { MarketingAction } from "../../../shared/GameState";
import { MovePlaceRestaurant } from "../../../shared/Moves";
import {
	parseTurnOrder,
	serialiseTurnOrder
} from "../../../shared/views/GameStateViews";
import { MarketingCampaignView } from "../../../shared/views/MarketingViews";
import { GetGameStateView } from "../dataViews";
import { getCurrentPlayer } from "../database/controller/gamestate.controller";
import {
	FullGameState,
	FullGameStateInclude
} from "../database/controller/includes";
import {
	CreateHouseView,
	MarketingTilesByNumber,
	parseJsonArray
} from "../utils";
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
		if (turnAction.type === "MARKETING") {
			await CreateMarketingCampaign(
				bundle,
				turnAction
			);
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
				},
				include: FullGameStateInclude
			});

		if (gameState.turnProgress !== "SALARY_PAYOUTS")
			throw new Error(
				`Attempted to handle end of round for a game that is not in the salary stage in lobby #${gameState.id}`
			);

		const gsv = GetGameStateView(gameState);

		for (const campaign of gsv.marketingCampaigns) {
			await BroadcastMarketing(bundle, campaign);
		}

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

const BroadcastMarketing: MoveTransactionFunctionTyped<
	MarketingCampaignView
> = async (bundle, campaign) => {
	const affectedHouses = await GetAffectedHouses(
		bundle,
		campaign
	);

	for (const house of affectedHouses) {
		await AddDemand(bundle, {
			house: house,
			foodType: campaign.foodType
		});
	}
};

const AddDemand: MoveTransactionFunctionTyped<{
	house: HouseView;
	foodType: FoodType;
}> = async (bundle, details): Promise<void> => {
	const { ctx, gameId } = bundle;
	const { house, foodType } = details;
	try {
		const existingHouse =
			await ctx.house.findUniqueOrThrow({
				where: {
					gameId_number: {
						gameId: gameId,
						number: house.priority
					}
				},
				include: {
					demand: true
				}
			});

		if (
			existingHouse.demand.length >=
			existingHouse.demandLimit
		) {
			console.log("House at demand limit. Skipping");
			return;
		}

		await ctx.house.update({
			where: {
				gameId_number: {
					gameId: gameId,
					number: existingHouse.number
				}
			},
			data: {
				demand: {
					create: {
						type: foodType
					}
				}
			}
		});
	} catch (error) {
		console.error(`Error finding house: ${error}`);
		return;
	}
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

const BackupTurnOrder: MoveTransactionFunctionUntyped =
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

const CreateMarketingCampaign: MoveTransactionFunctionTyped<
	MarketingAction
> = async (bundle, action) => {
	await bundle.ctx.marketingCampaign.create({
		data: {
			owner: {
				connect: {
					gamePlayerId: {
						gameId: bundle.gameId,
						number: bundle.player
					}
				}
			},

			priority: action.tile.tileNumber,
			orientation:
				action.tile.rotation === 0
					? "HORIZONTAL"
					: "VERTICAL",

			demand: action.tile.demand,

			// TODO: Add the actual number of turns remaining based on player choice
			turnsRemaining: 4,
			x: action.tile.pos.x,
			y: action.tile.pos.y,
			type: action.tile.marketingType,
			employeeIndex: action.tile.placingEmployee
		}
	});
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

	if (nextTurnProgress === "TURN_ORDER_SELECTION") {
		await BackupTurnOrder(bundle);
	} else if (nextTurnProgress === "SALARY_PAYOUTS") {
		await HandleEndOfRound(bundle);
	}

	await UnreadyPlayers(bundle);
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
) => Promise<any>;

type MoveTransactionFunctionTyped<T> = (
	bundle: TransactionBundle,
	details: T
) => Promise<any>;

type MoveTransactionFunction =
	| MoveTransactionFunctionUntyped
	| MoveTransactionFunctionTyped<any>;

export const BuildErrorMessage = (
	bundle: TransactionBundle,
	msg: string
) =>
	`Player ${bundle.player} attempted to ${msg.trim()} in lobby #${bundle.gameId}`;

const PickTurnOrder: MoveTransactionFunctionTyped<
	number
> = async (bundle, spot) => {
	const { ctx, gameId, player } = bundle;

	const gameState = await ctx.gameState.findUniqueOrThrow(
		{
			where: { id: gameId },
			include: FullGameStateInclude
		}
	);

	const currentPlayer = getCurrentPlayer(gameState);

	if (currentPlayer === null)
		throw new Error(
			"Current player is null during the pick turn order phase"
		);

	const currentTurnOrder = parseTurnOrder(
		gameState.turnOrder
	);
	if (currentTurnOrder.includes(player)) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter their turn order when it has already been chosen"
			)
		);
	} else if (
		spot >= currentTurnOrder.length ||
		spot < 0
	) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter an invalid turn order spot"
			)
		);
	} else if (currentTurnOrder[spot] !== null) {
		throw new Error(
			BuildErrorMessage(
				bundle,
				"enter a turn order spot that is already taken"
			)
		);
	}

	currentTurnOrder[spot] = player;

	// Will throw an error on failure
	try {
		await ctx.gameState.update({
			where: { id: gameId },
			data: {
				turnOrder: serialiseTurnOrder(
					currentTurnOrder
				)
			}
		});
	} catch (error) {
		throw new Error(
			`Committing turn order update to database failed in lobby #${gameState.id}. Error: ${JSON.stringify(error)} `
		);
	}
};

export default {
	AddNewRestaurant,
	AllPlayersReady,
	ExecuteTurn,
	NegotiateSalaries,
	HandleEndOfRound,
	UnreadyPlayers,
	ValidateTurnProgress,
	Restructure,
	ReadyPlayer,
	PickTurnOrder,
	CreateMarketingCampaign
};

export const HouseIsAffectedByMarketing = (
	house: FullGameState["houses"][number],
	campaign: MarketingCampaignView
): boolean => {
	if (campaign.type === "BILLBOARD") {
		return Area.IsAdjacent(
			{
				pos: { x: house.x, y: house.y },
				width: 2,
				height: 2
			},
			{
				...MarketingTilesByNumber[
				campaign.priority
				],

				pos: {
					x: campaign.pos.x,
					y: campaign.pos.y
				}
			}
		);
	}
	// TODO: Account for the other marketing types
	return true;
};

export const GetAffectedHouses: MoveTransactionFunctionTyped<
	MarketingCampaignView
> = async (bundle, campaign): Promise<HouseView[]> => {
	const { ctx, gameId } = bundle;
	const game: FullGameState =
		await ctx.gameState.findUniqueOrThrow({
			where: { id: gameId },
			include: FullGameStateInclude
		});

	return game.houses
		.filter((house) =>
			HouseIsAffectedByMarketing(house, campaign)
		)
		.map((house) => CreateHouseView(house));
};
