import { GameStatus } from ".";
import {
	BASE_GAME_MAP_PIECES,
	PLAYER_DEFAULTS,
	PlayerCount
} from "../defaults";
import { DemandRecord } from "../demand/DemandRecord";
import { GameMap, MapTile } from "../map";
import { HouseTile } from "../map/tiles/HouseTile";

import {
	MarketingTile,
	MarketingTilesByNumber
} from "../marketing/MarketingTile";
import { Player } from "../Player";
import { CardReserve } from "../Reserve";
import { MoveType } from "./Moves";

export interface GameState {
	currentTurn: number;
	players: Player[];
	map: GameMap;
	cardReserve: CardReserve;
	bankReserve: number;
	marketingTiles: MarketingTile[];
	status: GameStatus;
	turnOrder: number[];
	readyStatuses: boolean[];
}

interface NextActionDetails {
	playerIndices: number[];
	moveType: MoveType;
}

export const GameState = {
	clone(state: GameState): GameState {
		return JSON.parse(JSON.stringify(state));
	},

	allPlayersReady(state: GameState): boolean {
		return state.readyStatuses.every((v) => v);
	},

	getDinnertimeHouses(state: GameState): HouseTile[] {
		return (
			state.map.tiles.filter(
				(tile) => tile.tileType === "HOUSE"
			) as HouseTile[]
		)
			.filter((house) =>
				DemandRecord.isEmpty(house.demand)
			)
			.sort((house) => house.houseNumber);
	},

	nextStatus(state: GameState): GameStatus {
		switch (state.status) {
			case "PLACING_FIRST_RESTAURANTS": {
				// If all players have placed a restaurant
				if (
					state.map.tiles.filter(
						(tile) =>
							tile.tileType === "RESTAURANT"
					).length === state.players.length
				) {
					return "SELECTING_BANK_RESERVE";
				}

				return "PLACING_FIRST_RESTAURANTS_WAVE_TWO";
			}
			case "PLACING_FIRST_RESTAURANTS_WAVE_TWO": {
				return "SELECTING_BANK_RESERVE";
			}
			case "SELECTING_BANK_RESERVE": {
				return "WORKING_NINE_TO_FIVE";
			}
			// Standard loop
			case "RESTRUCTURING": {
				return "SELECTING_TURN_ORDER";
			}
			case "SELECTING_TURN_ORDER": {
				return "WORKING_NINE_TO_FIVE";
			}
			case "WORKING_NINE_TO_FIVE": {
				return "SALARY_PAYOUTS";
			}
			case "SALARY_PAYOUTS": {
				return "RESTRUCTURING";
			}
			default:
				state.status satisfies never;
		}

		return "RESTRUCTURING";
	},

	advance(
		state: GameState,
		playerIndices?: number | number[]
	): GameState | undefined {
		const newState: GameState = JSON.parse(
			JSON.stringify(state)
		);

		// Update ready statuses if they are provided, otherwise skip
		if (playerIndices !== undefined) {
			if (typeof playerIndices === "number") {
				newState.readyStatuses[playerIndices] =
					true;
			}
			// Guaranteed to be an array
			else {
				playerIndices.forEach(
					(index) =>
						(newState.readyStatuses[index] =
							true)
				);
			}
		}

		// If there is a player not ready, return
		if (!GameState.allPlayersReady(newState)) {
			return newState;
		}

		// Handle end of phase

		// If all players are ready, run as many events as possible
		switch (newState.status) {
			case "RESTRUCTURING": {
				// If exiting restructuring, ensure turn order is backed up and pick order is settled
				// await BackupTurnOrder(bundle);
				break;
			}
			case "WORKING_NINE_TO_FIVE": {
				// If exiting employee play phase, then dinnertime should be executed, followed by salaries
				// HandleDinnertime(bundle);
				// HandleEndOfRound(bundle);

				break;
			}
			case "SALARY_PAYOUTS": {
				newState.currentTurn++;

				break;
			}
		}

		// Update status and unready all players
		newState.status = GameState.nextStatus(newState);
		newState.readyStatuses = newState.readyStatuses.map(
			(_) => false
		);
	},

	canPlaceTile(
		state: GameState,
		newTile: MapTile
	): boolean {
		// Return true if no collisions occur
		return state.map.tiles.every(
			(tile) => !MapTile.areColliding(tile, newTile)
		);
	},

	placeNewTile(
		state: GameState,
		newTile: MapTile
	): GameState | undefined {
		// If any tile occupies the area which the new tile will be placed in
		if (!GameState.canPlaceTile(state, newTile)) {
			// Unable to add new tile if they are colliding
			return undefined;
		}

		const newState: GameState = JSON.parse(
			JSON.stringify(GameState)
		);

		newState.map.tiles.push(newTile);

		return newState;
	},

	nextMove(
		state: GameState
	): NextActionDetails | undefined {
		// If all players are ready
		if (state.readyStatuses.every((v) => v)) {
			return undefined;
		}

		const firstUnready = state.readyStatuses.findIndex(
			(status) => status === false
		);
		// Assert that at least one player must be unready
		if (firstUnready === -1) {
			return undefined;
		}

		switch (state.status) {
			case "PLACING_FIRST_RESTAURANTS":
			case "PLACING_FIRST_RESTAURANTS_WAVE_TWO": {
				return {
					moveType: MoveType.PLACE_RESTAURANT,
					playerIndices: [
						state.turnOrder[firstUnready]
					]
				};
			}
			case "SELECTING_BANK_RESERVE": {
				return {
					moveType: MoveType.SELECT_BANK_RESERVE,
					playerIndices: state.turnOrder.filter(
						(_, i) => !state.readyStatuses[i]
					)
				};
			}
			case "RESTRUCTURING": {
				return {
					moveType: MoveType.RESTRUCTURE,
					playerIndices: state.turnOrder.filter(
						(_, i) => !state.readyStatuses[i]
					)
				};
			}
			case "SELECTING_TURN_ORDER": {
				return {
					moveType: MoveType.SELECT_TURN_ORDER,
					playerIndices: [
						state.turnOrder[firstUnready]
					]
				};
			}
			case "WORKING_NINE_TO_FIVE": {
				return {
					moveType: MoveType.WORK_EMPLOYEES,
					playerIndices: [
						state.turnOrder[firstUnready]
					]
				};
			}
			case "SALARY_PAYOUTS": {
				return {
					moveType: MoveType.NEGOTIATE_SALARIES,
					playerIndices: state.turnOrder.filter(
						(_, i) => !state.readyStatuses[i]
					)
				};
			}
			// Unreachable
			default:
				state.status satisfies never;
		}
	}
};

export interface NewGameParams {
	playerCount: PlayerCount;
	seed?: number;
}

export function newGame(params: NewGameParams): GameState {
	const reserve = CardReserve.create(params.playerCount);
	const players = [];
	for (let i = 0; i < params.playerCount; i++) {
		players.push(Player.create(i));
	}

	const map = GameMap.create(
		params.playerCount,
		BASE_GAME_MAP_PIECES,
		params.seed
	);

	const marketingTiles: MarketingTile[] = [];

	for (const entry of Object.entries(
		MarketingTilesByNumber
	)) {
		if (
			!PLAYER_DEFAULTS[
				params.playerCount
			].marketingUnused.has(Number(entry[0]))
		) {
			marketingTiles.push(
				JSON.parse(
					JSON.stringify(entry[1])
				) as MarketingTile
			);
		}
	}

	const turnOrder = [
		...Array(params.playerCount).keys()
	].sort((_a, _b) => {
		return Math.random() - 0.5;
	});

	const readyStatuses = [
		...Array(params.playerCount).keys()
	].map((_) => false);

	return {
		currentTurn: 0,
		cardReserve: reserve,
		players,
		map,
		marketingTiles,
		bankReserve: params.playerCount * 50,
		status: "PLACING_FIRST_RESTAURANTS",
		turnOrder,
		readyStatuses
	};
}

// TODO: Implement these old backend functions in the core
/*
export function getTurnOrderPickOrder(
	game: FullGameState
): number[] {
	const sortedPlayers = game.players.sort(
		(player1, player2) => {
			const player1Tree =
				GetEmployeeTreeOrThrow(player1);
			const player2Tree =
				GetEmployeeTreeOrThrow(player2);

			// If the number of empty slots is different, return the one with more empty slots
			const diff =
				CountEmptySlots(player1Tree) -
				CountEmptySlots(player2Tree);
			if (diff !== 0) return diff;

			// Otherwise, return whoever was previously in turn order before the current turn
			const index1 = parseTurnOrder(
				game.oldTurnOrder
			).findIndex((p) => p === player1.number);
			const index2 = parseTurnOrder(
				game.oldTurnOrder
			).findIndex((p) => p === player2.number);

			if (index1 === -1 || index2 === -1)
				throw new Error(
					`Invalid turn order for lobby #${game.id}`
				);

			return index2 - index1;
		}
	);

	return sortedPlayers.map((player) => player.number);
}

export function getTurnOrderSelectionCurrentPlayer(
	game: FullGameState
): number {
	const currentTurnOrder = parseTurnOrder(game.turnOrder);
	const oldTurnOrder = parseTurnOrder(game.oldTurnOrder);

	// const playerOrder = getTurnOrderPickOrder(game);

	for (const playerNumber of oldTurnOrder) {
		if (playerNumber === null)
			throw new Error(
				`Null player found in oldTurnOrder #${game.id}`
			);
		const player = game.players.find(
			(player) => player.number === playerNumber
		);
		if (!player)
			throw new Error(
				`Invalid player number found in turn order for lobby #${game.id}`
			);

		// If player is ready and they haven't chosen, throw an error
		if (player.ready === READY_STATUS.READY) {
			if (!currentTurnOrder.includes(player.number))
				throw new Error(
					`Ready player found in turn order for lobby #${game.id}, but they haven't chosen their turn order yet.`
				);

			continue;
		}

		// If player is not ready and they have chosen, throw an error
		if (currentTurnOrder.includes(player.number))
			throw new Error(
				`Not-ready player found in turn order for lobby #${game.id}, but they have chosen their turn order already.`
			);
		return player.number;
	}

	throw new Error(
		`Unable to find the next player to choose turn order in lobby #${game.id}`
	);
}

*/
