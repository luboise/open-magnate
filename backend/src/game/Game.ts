import {
	Food,
	GameCreationParams,
	GameState,
	House,
	MapTileData,
	TurnProgress
} from "../utils";

export class Game {
	private playerCount: number;
	private state: GameState;

	constructor(params: GameCreationParams) {
		const playerCount = params.players.length;
		if (playerCount < 2) {
			throw new Error(
				"Game must have at least 2 players"
			);
		}
		this.playerCount = playerCount;

		const [mapTiles, houses] = createMap(playerCount);

		this.state = {
			currentPlayer: -1,
			turnProgress: TurnProgress.RESTAURANT_PLACEMENT,
			currentTurn: 1,
			turnOrder: null,
			houses,
			mapTiles,
			players: params.players
		};
	}

	public addDemand(h: House, f: Food): boolean {
		if (h.demand.length < h.demandLimit) {
			h.demand.push(f);
			return true;
		}

		return false;
	}

	public getGameState(): GameState {
		return { ...this.state };
	}
}

function createMap(
	playerCount: number
): [MapTileData[], House[]] {
	// TODO: Fix function stub
	const data: MapTileData[] = [];
	const houses: House[] = [];
	return [data, houses];
}

function NewGame(params: GameCreationParams): GameState {
	const players = params.players;
	const mapTiles: MapTileData[] = [];
	const houses: House[] = [];

	return {
		currentPlayer: -1,
		turnProgress: TurnProgress.RESTAURANT_PLACEMENT,
		currentTurn: 1,
		turnOrder: null,
		houses,
		mapTiles,
		players
	};
}
