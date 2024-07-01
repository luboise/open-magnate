import {
	GameState,
	Lobby,
	Prisma,
	TURN_PROGRESS
} from "@prisma/client";
import {
	MAP_PIECES,
	MapStringChar,
	createMapString
} from "../../game/MapPieces";
import {
	GameStateView,
	GetTransposed,
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	PLAYER_DEFAULTS
} from "../../utils";
import GameStateRepository from "../repository/gamestate.repository";
import LobbyRepository from "../repository/lobby.repository";
function copyArray<T>(
	data: T[][],
	mainArray: T[][],
	xStart: number = 0,
	yStart: number = 0
) {
	for (let x = 0; x < data.length; x++) {
		for (let y = 0; y < data[x].length; y++) {
			const outVal = data[x][y] as T;

			mainArray[x + xStart][y + yStart] = outVal;
		}
	}

	// return outArray;
}

const GameStateController = {
	Get: async (id: number) => {
		return await LobbyRepository.findFirst({
			where: {
				id: id
			}
		});
	},

	NewMap: (
		playerCount: number
	): [
		mapString: string,
		Prisma.HouseCreateManyGameInput[]
	] => {
		const defaults = PLAYER_DEFAULTS[playerCount];

		if (!defaults)
			throw new Error("Invalid player count");

		const houses: Prisma.HouseCreateManyGameInput[] =
			[];

		// Unused map pieces in a random order
		const unusedMapPieces = new Array(20)
			.fill(null)
			.map((_val, index) => index + 1)
			.sort((_a, _b) => Math.random() - 0.5);

		// Create an empty array to put the tiles into
		// mapArray[x][y]
		// Column major order
		const mapArray: MapStringChar[][] = new Array(
			defaults.mapWidth * MAP_PIECE_WIDTH
		)
			.fill("X")
			.map((_) =>
				new Array(
					defaults.mapHeight * MAP_PIECE_HEIGHT
				).fill("X")
			);

		// While the map hasn't been filled
		for (
			let pieceX = 0;
			pieceX < defaults.mapWidth;
			pieceX++
		) {
			for (
				let pieceY = 0;
				pieceY < defaults.mapHeight;
				pieceY++
			) {
				if (unusedMapPieces.length === 0)
					throw new Error(
						"Ran out of map pieces. This shouldn't happen."
					);

				const tileKey = unusedMapPieces.pop();

				if (!tileKey) {
					console.error(
						"Invalid index received from unusedMapPieces. Skipping."
					);
					continue;
				}

				const piece = MAP_PIECES[tileKey];

				// console.log("piece: ", piece);

				if (!piece) {
					console.log(
						`Piece ${tileKey} is invalid. Skipping this piece.`
					);
					continue;
				}

				copyArray(
					GetTransposed(piece),
					mapArray,
					pieceX * MAP_PIECE_WIDTH,
					pieceY * MAP_PIECE_HEIGHT
				);

				// console.log(mapArray);

				// If there is a house in this tile
				const houseIndex = piece
					.flat()
					.findIndex((char) => char === "H");
				if (houseIndex !== -1) {
					houses.push({
						number: tileKey,
						x:
							pieceX * MAP_PIECE_WIDTH +
							(houseIndex % MAP_PIECE_WIDTH),
						y:
							pieceY * MAP_PIECE_HEIGHT +
							Math.floor(
								houseIndex / MAP_PIECE_WIDTH
							)
					});
				}
			}
		}

		// console.log(mapArray);

		const outString = createMapString(mapArray);
		// console.log(outString);

		return [outString, houses];
	},

	Create: async (lobby: Lobby) => {
		const [map, houses] = GameStateController.NewMap(
			lobby.playerCount
		);
		return await GameStateRepository.create({
			data: {
				lobby: {
					connect: {
						id: lobby.id
					}
				},
				rawMap: map,
				houses: {
					createMany: {
						data: houses
					}
				}

				// currentTurn: 0,
				// currentPlayer: null,
				// turnProgress: TurnProgress.SETTING_UP
			}
		});
	},

	AddStateToLobby: async (lobby: Lobby) => {
		const [map, houses] = GameStateController.NewMap(
			lobby.playerCount
		);

		const encodedMap =
			// Buffer.from(map).toString("base64");
			map;

		const updated = await LobbyRepository.update({
			where: {
				id: lobby.id
			},
			data: {
				gameState: {
					create: {
						rawMap: encodedMap,
						houses: {
							createMany: {
								data: houses
							}
						}
					}
				}
			}
		});

		return Boolean(updated);
	},

	GetGameStateView: async (
		gs: GameState
	): Promise<GameStateView | null> => {
		if (!gs) return null;

		const gameStateView =
			await GameStateRepository.findFirstOrThrow({
				where: {
					id: gs.id
				},
				include: {
					lobby: {
						include: {
							players: {
								include: {
									restaurant: true,
									userSession: true
								}
							}
						}
					},
					houses: {
						include: {
							demand: true,
							garden: true
						}
					},
					marketingCampaigns: true,
					players: true
				}
			});

		return {
			players: gameStateView.lobby.players.map(
				(player) => ({
					name: player.userSession.name,
					restaurant: player.restaurant.name
				})
			),

			currentTurn: gameStateView.currentTurn,
			currentPlayer: gameStateView.currentPlayer,
			map: gameStateView.rawMap,
			houses: gameStateView.houses,
			// TODO: Fix turn order to be included in the view
			// turnOrder: gs.turnOrder
			turnOrder: null
		} as GameStateView;
	},

	StartGame: async (
		lobbyId: number
	): Promise<boolean> => {
		const updated = await GameStateRepository.update({
			where: {
				id: lobbyId
			},
			data: {
				currentTurn: 1,
				currentPlayer: 1,
				turnProgress: TURN_PROGRESS.SETTING_UP
			}
		});

		return Boolean(updated);
	}
};

export default GameStateController;
