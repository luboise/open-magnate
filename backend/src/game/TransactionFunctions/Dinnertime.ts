import { CreateGameStateView } from "../../dataViews";
import {
	FullGamePlayer,
	FullGameStateInclude,
	FullHouse
} from "../../database/controller/includes";
import {
	DEMAND_TYPE,
	DemandRecord,
	DemandRecords,
	Employee,
	GamePlayerViewPrivate,
	GameStateView,
	HouseView,
	Map2D
} from "../../utils";
import {
	HouseDistances,
	MoveTransactionFunctionTyped,
	MoveTransactionFunctionUntyped
} from "./types";

// Gets the dinnertime winner of 2 players. Sorted in ascending order, where lowest position means highest priority
function CalculateDinnertimeWinner(houseNumber: number) {
	return (
		p1: PlayerDinnertimeDetails,
		p2: PlayerDinnertimeDetails
	): number => {
		const p1Score = p1.distances[houseNumber];
		const p2Score = p2.distances[houseNumber];

		if (p1Score === null && p2Score === null)
			throw new Error(
				"Both scores are null. Unable to decide a dinnertime winner."
			);
		if (p1Score === null && p2Score !== null) return 1;
		if (p2Score === null && p1Score !== null) return -1;

		let diff = p1Score! - p2Score!;
		if (diff !== 0) return diff;

		diff = p1.waitresses - p2.waitresses;
		if (diff !== 0) return diff;

		diff = p1.turnOrder - p2.turnOrder;
		if (diff === 0)
			throw new Error(
				"Cannot determine a winner in Dinnertime. This is likely a turn order issue."
			);
		return diff;
	};
}

export const HandleDinnertime: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId } = bundle;

		const gameState =
			await ctx.gameState.findUniqueOrThrow({
				where: {
					id: gameId
				},
				include: FullGameStateInclude
			});
		const gsv = CreateGameStateView(gameState);

		const { houses } = gsv;

		const details = GetDinnertimeDetails(gsv);

		function CanSatisfy(
			player: PlayerDinnertimeDetails,
			house: HouseView
		): boolean {
			if (player.distances[house.priority] === null)
				return false;

			const houseDemands = DemandRecords.FromDemands(
				house.demand
			);

			// Can safely typecast, as houseDemands uses DEMAND_TYPE as a key
			for (const demand in houseDemands) {
				if (
					player.supply[demand as DEMAND_TYPE] <
					houseDemands[demand as DEMAND_TYPE]
				)
					return false;
			}
			return true;
		}

		for (const house of houses
			.filter((house) => house.demand.length)
			.sort((house) => house.priority)) {
			const players = details
				.filter((player) =>
					CanSatisfy(player, house)
				)
				.sort(
					CalculateDinnertimeWinner(
						house.priority
					)
				);

			if (players.length === 0) continue;

			await PlayerSellsDemand(bundle, {
				player: players[0],
				houseNumber: house.priority
			});
			/**console.debug(
				`Need to implement selling house ${house.priority} to player ${players[0].playerNumber} in game ${gameId}.`
			);**/
		}
	};

const PlayerSellsDemand: MoveTransactionFunctionTyped<{
	player: PlayerDinnertimeDetails;
	houseNumber: number;
}> = async (bundle, details) => {
	const { ctx, gameId } = bundle;

	const game = await ctx.gameState.findUniqueOrThrow({
		where: { id: gameId },
		include: FullGameStateInclude
	});

	const house = game.houses.find(
		(house) => house.number === details.houseNumber
	);
	if (!house)
		throw new Error(
			`House ${details.houseNumber} not found.`
		);

	for (const demand of house.demand) {
		await ctx.houseDemand.delete({
			where: {
				demandId: (
					await ctx.houseDemand.findFirstOrThrow({
						where: {
							type: demand.type,
							houseId: house.id
						}
					})
				).demandId
			}
		});
		const playerDemand =
			await ctx.playerDemand.findFirstOrThrow({
				where: {
					type: demand.type,
					gameId: gameId,
					playerNumber:
						details.player.playerNumber
				}
			});
		await ctx.playerDemand.delete({
			where: {
				demandId: playerDemand.demandId
			}
		});
	}

	await ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: gameId,
				number: details.player.playerNumber
			}
		},
		data: {
			money: {
				// TODO: Calculate the actual amount that the player receives
				increment: 10 * house.demand.length
			}
		}
	});
};

export interface PlayerDinnertimeDetails {
	playerNumber: number;
	supply: DemandRecord;
	distances: HouseDistances;
	unitPrice: number;
	waitresses: number;
	turnOrder: number;
}

export function GetHouseDistances(
	game: GameStateView,
	playerNumber: number
): HouseDistances {
	const player = game.players.find(
		(player) => player.playerNumber === playerNumber
	);

	if (player === undefined)
		throw new Error(
			`Expected to find player by ID ${playerNumber}`
		);

	return game.houses.reduce<HouseDistances>(
		(acc, house) => {
			acc[house.priority] = GetPlayerDistanceToHouse(
				player,
				house,
				game.map
			);
			return acc;
		},
		{}
	);
}

export function GetDinnertimeDetails(
	game: GameStateView
): PlayerDinnertimeDetails[] {
	function GetDetails(
		player: GamePlayerViewPrivate
	): PlayerDinnertimeDetails {
		return {
			playerNumber: player.playerNumber,
			supply: DemandRecords.FromPlayer(player),
			distances: GetHouseDistances(
				game,
				player.playerNumber
			),
			// TODO: Fix this to be based on employee tree
			unitPrice: 10,

			waitresses: player.employees.filter(
				(employee) =>
					Employee.ById(employee).type ===
					"WAITRESS"
			).length,
			turnOrder: game.turnOrder.findIndex(
				(value) => value === player.playerNumber
			)
		};
	}

	return game.players.map((player) => GetDetails(player));
}

export function GetPlayerDistanceToHouse(
	_player: FullGamePlayer | GamePlayerViewPrivate,
	_house: FullHouse | HouseView,
	_map: Map2D
): number | null {
	// TODO: Implement pathfinding from the house to each restaurant. For now, we will assume every restaurant is the same distance
	return 0;
}
/**
export function GetPlayerScore(
	player: FullGamePlayer,
	house: FullHouse
): number | null {

	const tileDistance = 0;
	const basePrice = 10;

	const _ignore = tileDistance + basePrice

	return null;
}
**/
