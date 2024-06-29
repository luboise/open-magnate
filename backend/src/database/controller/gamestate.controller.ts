import { Lobby, Prisma } from "@prisma/client";
import {
	MAP_PIECES,
	MapStringChar,
	createMapString
} from "../../game/MapPieces";
import {
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
): T[][] {
	const outArray = [...mainArray];

	for (let x = 0; x < data.length; x++) {
		for (let y = 0; y < data[x].length; y++) {
			const outVal = data[x][y] as T;

			outArray[x + xStart][y + yStart] = outVal;
		}
	}

	return outArray;
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

		const unusedMapPieces = new Set<number>(
			new Array(20).fill(1, 20)
		);

		// Create an empty array to put the tiles into
		// mapArray[x][y]
		// Column major order
		const mapArray: MapStringChar[][] = new Array(
			defaults.mapWidth * MAP_PIECE_HEIGHT
		)
			.fill(null)
			.map((_) =>
				new Array(
					defaults.mapWidth * MAP_PIECE_WIDTH
				).fill(null)
			);

		// While the map hasn't been filled
		for (
			let pieceX = 0;
			pieceX < defaults.mapHeight * defaults.mapWidth;
			pieceX++
		) {
			for (
				let pieceY = 0;
				pieceY <
				defaults.mapHeight * defaults.mapWidth;
				pieceY++
			) {
				// Select a random unused tile
				const tileKey = unusedMapPieces
					.values()
					.next().value;
				unusedMapPieces.delete(tileKey);

				const piece = MAP_PIECES[tileKey];

				// console.log("piece: ", piece);

				if (!piece) continue;

				copyArray(
					piece,
					mapArray,
					pieceX * MAP_PIECE_WIDTH,
					pieceY * MAP_PIECE_HEIGHT
				);

				// console.log(mapArray);

				// If there is a house in this tile
				if (
					piece.some((row) => row.includes("H"))
				) {
					houses.push({
						number: tileKey,
						x: pieceX * MAP_PIECE_WIDTH,
						y: pieceY * MAP_PIECE_HEIGHT
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

		const updated = await LobbyRepository.update({
			where: {
				id: lobby.id
			},
			data: {
				gameState: {
					create: {
						rawMap: map,
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
	}
};

export default GameStateController;
