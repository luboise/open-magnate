import { Lobby, Prisma } from "@prisma/client";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	PLAYER_DEFAULTS
} from "../../utils";
import GameStateRepository from "../repository/gamestate.repository";
import LobbyRepository from "../repository/lobby.repository";
import { MAP_PIECES } from "../../game/MapPieces";

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

		const unusedMapPieces = new Set<number>(
			new Array(20).fill(1, 20)
		);

		// Create an empty array to put the tiles into
		// mapArray[x][y]
		// Column major order
		const mapArray: string[][] = new Array(
			defaults.mapWidth * MAP_PIECE_HEIGHT
		).map((_) =>
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
                pieceY < defaults.mapHeight * defaults.mapWidth;
                pieceY++
            ) {
                // Select a random unused tile
				const tileKey = unusedMapPieces.values().next().value;
                unusedMapPieces.delete(tileKey);

                const piece = MAP_PIECES[tileKey];	

				// rotate the piece by a random amount
				
		}
		// Select a random unused tile

		// Attempt to fit it every way

		// If we find a valid way to fit the pieces together, place it

		// Otherwise, try a different tile

		return ["", []];
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
	}

	// AddStateToLobby: async (lobby: Lobby) => {

	// 	return await LobbyRepository.update({
	// 		where: {
	// 			id: lobby.id
	// 		},
	// 		data: {
	// 			gameState: {
	// 				create: {
	// 					lobby: {
	// 						connect: {
	// 							id: lobby.id
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	});
	// }
};

export default GameStateController;
