// import {
// 	Food,
// 	GameCreationParams,
// 	GameState,
// 	House,
// 	MapPieceData,
// 	TileType,
// 	TurnProgress,
// 	CreateHouse as createHouse
// } from "../utils";
// import { MAP_PIECES } from "./GameStores";
// import { translateMapTile as TranslateMapTile } from "./Map";

// export class Game {
// 	private playerCount: number;
// 	private state: GameState;

// 	constructor(params: GameCreationParams) {
// 		const playerCount = params.players.length;
// 		if (playerCount < 2) {
// 			throw new Error(
// 				"Game must have at least 2 players"
// 			);
// 		}
// 		this.playerCount = playerCount;

// 		const [mapPieces, houses] = createMap(playerCount);

// 		this.state = {
// 			currentPlayer: -1,
// 			turnProgress: TurnProgress.RESTAURANT_PLACEMENT,
// 			currentTurn: 1,
// 			turnOrder: null,
// 			houses,
// 			mapPieces,
// 			players: params.players
// 		};
// 	}

// 	public addDemand(h: House, f: Food): boolean {
// 		if (h.demand.length < h.demandLimit) {
// 			h.demand.push(f);
// 			return true;
// 		}

// 		return false;
// 	}

// 	public getGameState(): GameState {
// 		return { ...this.state };
// 	}
// }

// interface MapSize {
// 	x: number;
// 	y: number;
// }
// const MAP_SIZES: Record<number, MapSize> = {
// 	2: { x: 3, y: 3 },
// 	3: { x: 4, y: 3 },
// 	4: { x: 4, y: 4 },
// 	5: { x: 4, y: 5 }
// };

// function createMap(
// 	playerCount: number
// ): [MapPieceData[], House[]] {
// 	const mapPieces: MapPieceData[] = [];

// 	if (!MAP_SIZES[playerCount]) {
// 		throw new Error(
// 			`Invalid player count: ${playerCount}`
// 		);
// 	}

// 	const dimensions = MAP_SIZES[playerCount];

// 	const tuplesToPlace = Array.from({
// 		length: dimensions.x
// 	})
// 		.flatMap((_, i) =>
// 			Array.from({ length: dimensions.y }, (_, j) => {
// 				return {
// 					x: i,
// 					y: j
// 				} as MapSize;
// 			})
// 		)
// 		.sort(() => Math.random() - 0.5);

// 	const unusedTileKeys: number[] = Array.from(
// 		Object.keys(MAP_PIECES)
// 	)
// 		.map((val) => Number(val))
// 		.sort((_a, _b) => Math.random() - 0.5);

// 	const houses: House[] = [];

// 	while (tuplesToPlace.length) {
// 		const val = tuplesToPlace.pop();
// 		if (!val) {
// 			throw new Error(
// 				"Invalid tuple mapped into a tile."
// 			);
// 		}

// 		const newTileKey = unusedTileKeys.pop();
// 		if (!newTileKey) {
// 			throw new Error("No more unused map tiles.");
// 		}

// 		const piece = MAP_PIECES[newTileKey];
// 		piece.tiles = piece.tiles.map((row) =>
// 			row.map((tile) =>
// 				TranslateMapTile(tile, val.x, val.y)
// 			)
// 		);

// 		mapPieces.push(piece);
// 		// If any of the pieces tiles has a house
// 		if (
// 			piece.tiles.some((row) =>
// 				row.some(
// 					(tile) => tile.type === TileType.HOUSE
// 				)
// 			)
// 		) {
// 			houses.push(createHouse(piece.id));
// 		}
// 	}

// 	return [mapPieces, houses];
// }

// function NewGame(params: GameCreationParams): GameState {
// 	const players = params.players;
// 	const [mapPieces, houses] = createMap(players.length);

// 	return {
// 		currentPlayer: -1,
// 		turnProgress: TurnProgress.RESTAURANT_PLACEMENT,
// 		currentTurn: 1,
// 		turnOrder: null,
// 		houses,
// 		mapPieces,
// 		players
// 	};
// }
