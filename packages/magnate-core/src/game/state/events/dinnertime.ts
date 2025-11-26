import { GameState } from "../GameState";

export function HandleDinnertime(
	state: GameState
): GameState | undefined {
	const newState: GameState = JSON.parse(
		JSON.stringify(state)
	);

	for (const _house of GameState.getDinnertimeHouses(
		newState
	)) {
		/*
		const players = state.players.filter(
			(player) =>
				Player.canSatisfyDemand(
					player,
					house.demand
				) // TODO: Implement player to house reach check
			// && Player.canReachHouse(player, house)
		);
		*/
		// .sort(
		// CalculateDinnertimeWinner(house.houseNumber)
		// )
		continue;

		// TODO: Re-implement demand selling
		/*
		// If no-one can sell
		if (players.length === 0) continue;

		PlayerSellsDemand(bundle, {
			player: players[0],
			houseNumber: house.priority
		});
		*/
	}

	return newState;
}

/*
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
*/

/*
const PlayerSellsDemand: MoveTransactionFunctionTyped<{
	player: PlayerDinnertimeDetails;
	houseNumber: number;
}> = async (bundle, details) => {
	const { ctx, gameId, transactionInfo, currentTurn } =
		bundle;
	const { player, houseNumber } = details;

	const game = await ctx.gameState.findUniqueOrThrow({
		where: { id: gameId },
		include: FullGameStateInclude
	});

	const house = game.houses.find(
		(house) => house.number === houseNumber
	);
	if (!house)
		throw new Error(`House ${houseNumber} not found.`);

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
					playerNumber: player.playerNumber
				}
			});
		await ctx.playerDemand.delete({
			where: {
				demandId: playerDemand.demandId
			}
		});

		player.supply[demand.type] -= 1;
	}

	await ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: gameId,
				number: player.playerNumber
			}
		},
		data: {
			money: {
				// TODO: Calculate the actual amount that the player receives
				increment: 10 * house.demand.length
			}
		}
	});

	transactionInfo.push({
		type: "DinnertimeSell",
		turn: currentTurn,
		player: player.playerNumber,
		house: house.number,
		sold: house.demand.map((demand) => demand.type)
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
					getEmployeeById(employee).department ===
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
*/

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
*/
