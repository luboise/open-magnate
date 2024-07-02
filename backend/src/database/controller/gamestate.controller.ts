import { Prisma, TURN_PROGRESS } from "@prisma/client";
import { GardenView } from "../../dataViews";
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
import { FullLobby } from "./lobby.controller";
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
		try {
			return await GameStateRepository.findFirst({
				where: {
					id: id
				},
				include: {
					houses: {
						include: {
							demand: true,
							garden: true
						}
					},
					marketingCampaigns: true,
					players: {
						include: {
							restaurant: true,
							lobbyPlayer: {
								include: {
									userSession: {
										select: {
											name: true
										}
									}
								}
							}
						}
					}
				}
			});
		} catch (error) {
			console.error(error);
		}

		return null;
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

	// Create: async (lobby: FullLobby) => {
	// 	const [map, houses] = GameStateController.NewMap(
	// 		lobby.gameState.playerCount
	// 	);
	// 	return await GameStateRepository.create({
	// 		data: {
	// 			lobby: {
	// 				connect: {
	// 					id: lobby.id
	// 				}
	// 			},
	// 			rawMap: map,
	// 			houses: {
	// 				createMany: {
	// 					data: houses
	// 				}
	// 			}

	// 			// currentTurn: 0,
	// 			// currentPlayer: null,
	// 			// turnProgress: TurnProgress.SETTING_UP
	// 		}
	// 	});
	// },

	GetGameStateView: async (
		lobbyId: number
	): Promise<GameStateView | null> => {
		const gameState =
			await GameStateController.Get(lobbyId);
		if (!gameState) return null;

		return {
			currentPlayer: gameState.currentPlayer,
			currentTurn: gameState.currentTurn,
			turnProgress: gameState.turnProgress,
			map: gameState.rawMap,
			playerCount: gameState.playerCount,
			turnOrder:
				gameState.turnOrder
					.split("")
					.map((str) => Number(str)) ?? null,
			marketingCampaigns:
				gameState.marketingCampaigns.map(
					(campaign) => {
						return {
							priority: campaign.number,
							turnsRemaining:
								campaign.turnsRemaining,

							type: campaign.type,
							x: campaign.x,
							y: campaign.y,
							orientation:
								campaign.orientation
						};
					}
				),
			gardens: gameState.houses
				.filter((house) => house.garden)
				.map((house): GardenView => {
					// Can safely ignore TypeScript type complaints since we pre-filtered the list
					return {
						houseNumber: house.number,
						x: house.garden!.x,
						y: house.garden!.y,
						orientation:
							house.garden!.orientation
					};
				}),
			houses: gameState.houses.map((house) => ({
				demand: house.demand.map(
					(demand) => demand.type
				),
				demandLimit: house.demandLimit,
				priority: house.number,
				x: house.x,
				y: house.y,
				garden: house.garden
					? {
							houseNumber:
								house.garden?.houseId,
							x: house.garden?.x,
							y: house.garden?.y,
							orientation:
								house.garden?.orientation
						}
					: null,
				orientation: "HORIZONTAL"
			}))
		};
	},

	StartGame: async (
		lobby: FullLobby
	): Promise<boolean> => {
		// Get the players in a random order
		const playerOrder = new Array(
			lobby.gameState.playerCount
		)
			.fill(null)
			.map((_, index) => index + 1)
			.sort((_a, _b) => Math.random() - 0.5);

		const updated = await GameStateRepository.update({
			where: {
				id: lobby.id
			},
			data: {
				currentTurn: 1,
				currentPlayer: playerOrder[0],
				turnOrder: playerOrder.join(""),
				turnProgress:
					TURN_PROGRESS.RESTAURANT_PLACEMENT
			}
		});

		return Boolean(updated);
	}
};

export default GameStateController;
