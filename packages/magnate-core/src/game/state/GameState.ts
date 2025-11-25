import { GameStatus, MoveType } from ".";
import { Player } from "../Player";
import { CardReserve } from "../Reserve";
import {
	BASE_GAME_MAP_PIECES,
	PLAYER_DEFAULTS,
	PlayerCount
} from "../defaults";
import { GameMap } from "../map";
import {
	MarketingTile,
	MarketingTilesByNumber
} from "../marketing/MarketingTile";

export interface GameState {
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
	players: number[];
	moveType: MoveType;
}

export const GameState = {
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
					players: [state.turnOrder[firstUnready]]
				};
			}
			case "SELECTING_BANK_RESERVE": {
				return {
					moveType: MoveType.SELECT_BANK_RESERVE,
					players: state.turnOrder.filter(
						(_, i) => !state.readyStatuses[i]
					)
				};
			}
			case "RESTRUCTURING": {
				return {
					moveType: MoveType.RESTRUCTURE,
					players: state.turnOrder.filter(
						(_, i) => !state.readyStatuses[i]
					)
				};
			}
			case "SELECTING_TURN_ORDER": {
				return {
					moveType: MoveType.SELECT_TURN_ORDER,
					players: [state.turnOrder[firstUnready]]
				};
			}
			case "WORKING_NINE_TO_FIVE": {
				return {
					moveType: MoveType.WORK_EMPLOYEES,
					players: [state.turnOrder[firstUnready]]
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
		players.push(Player.create());
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
