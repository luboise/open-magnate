import {
	Prisma,
	READY_STATUS,
	TURN_PROGRESS
} from "@prisma/client";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	PLAYER_DEFAULTS,
	RestaurantView
} from "../../../../shared";
import { MoveData } from "../../../../shared/Moves";
import {
	GamePlayerViewPrivate,
	GameStateView,
	GameStateViewPerPlayer,
	GardenView
} from "../../dataViews";
import prisma from "../../datasource";
import { TransactMove as TransactMoves } from "../../game/HandleMove";
import {
	MAP_PIECES,
	MapStringChar,
	createMapString
} from "../../game/MapPieces";
import { Reserve } from "../../game/NewGameStructures";
import {
	GetTransposed,
	parseJsonArray,
	readJsonNumberArray as parseJsonNumberArray
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

function ReadyStatusToBoolean(
	status: READY_STATUS
): boolean | null {
	switch (status) {
		case "READY":
			return true;
		case "NOT_READY":
			return false;
		default:
			return null;
	}
}

export const FullGameStateInclude = {
	houses: {
		include: {
			demand: true,
			garden: true
		}
	},
	marketingCampaigns: true,
	players: {
		include: {
			restaurantData: true,
			lobbyPlayer: {
				include: {
					userSession: {
						select: {
							name: true
						}
					}
				}
			},
			restaurants: true
		}
	}
};

export function getCurrentPlayer(
	game: FullGameState
): number | null {
	if (
		game.turnProgress === "RESTRUCTURING" ||
		game.turnProgress === "SALARY_PAYOUTS"
	)
		return null;

	const turnOrder = parseTurnOrder(
		game.turnProgress === "TURN_ORDER_SELECTION"
			? game.oldTurnOrder
			: game.turnOrder
	);
	for (const playerNumber of turnOrder) {
		if (playerNumber === null) continue;
		const player = game.players.find(
			(player) => player.number === playerNumber
		);
		if (!player) {
			throw new Error(
				`Invalid player index (${playerNumber}) requested in lobby #${game.id}`
			);
		}
		if (player.ready === "READY") continue;

		return player.number;
	}

	return null;
}

export function parseTurnOrder(
	serialisedTurnOrder: string
): (number | null)[] {
	return serialisedTurnOrder
		.split("")
		.map((str) => (str === "X" ? null : Number(str)));
}

export function serialiseTurnOrder(
	turnOrder: (number | null)[]
): string {
	return turnOrder
		.map((player) =>
			player === null ? "X" : player.toString()
		)
		.join("");
}

export type FullGameState = Prisma.GameStateGetPayload<{
	include: typeof FullGameStateInclude;
}>;

const GameStateController = {
	Get: async (
		id: number
	): Promise<FullGameState | null> => {
		try {
			return await GameStateRepository.findFirst({
				where: {
					id: id
				},
				include: FullGameStateInclude
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

	GetGameStateView: (lobby: FullLobby): GameStateView => {
		const gameState = lobby.gameState;
		if (!gameState)
			throw new Error(
				"Unable to fetch GameStateView from lobby, as its GameState is null."
			);

		return {
			currentPlayer: getCurrentPlayer(gameState),
			currentTurn: gameState.currentTurn,
			turnProgress: gameState.turnProgress,
			map: gameState.rawMap,
			playerCount: gameState.playerCount,
			turnOrder: parseTurnOrder(gameState.turnOrder),
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
			})),
			players: gameState.players.map(
				(player): GamePlayerViewPrivate => ({
					money: player.money,
					playerNumber: player.number,
					restaurant: player.restaurantData.id,
					milestones: parseJsonNumberArray(
						player.milestones
					),
					employees: parseJsonArray(
						player.employees
					),
					employeeTreeStr: player.employeeTree,
					ready: ReadyStatusToBoolean(
						player.ready
					)
				})
			),
			restaurants: gameState.players
				.map((player) =>
					player.restaurants.map((res) => {
						const rv: RestaurantView = {
							player: player.number,
							x: res.x,
							y: res.y,
							orientation: "HORIZONTAL"
						};

						return rv;
					})
				)
				.flat(1),
			reserve: gameState.reserve as Reserve
		};
	},

	GetPublicGameStateView: (
		gsv: GameStateView,
		playerNumber: number
	): GameStateViewPerPlayer => {
		const player = gsv.players.find(
			(player) => player.playerNumber === playerNumber
		);
		if (!player)
			throw new Error(
				`Unable to get public game state for invalid player: ${playerNumber}`
			);

		const newVal: GameStateViewPerPlayer = {
			...gsv,
			players: gsv.players.map((eachPlayer) => {
				const { employees, ...rest } = eachPlayer;
				return {
					...rest
				};
			}),
			privateData: player
		};

		return newVal;
	},

	StartGame: async (
		lobby: FullLobby
	): Promise<boolean> => {
		if (!lobby.gameState) return false;

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
				turnOrder: playerOrder.join(""),
				turnProgress:
					TURN_PROGRESS.RESTAURANT_PLACEMENT
			}
		});

		return Boolean(updated);
	},

	AllPlayersReady: async (
		gameId: number
	): Promise<boolean> => {
		try {
			const players =
				await prisma.gamePlayer.findMany({
					where: {
						gameId: gameId
					}
				});

			return (
				players.every(
					(player) =>
						player.ready === READY_STATUS.READY
				) ||
				players.every(
					(player) =>
						player.ready ===
						READY_STATUS.NOT_APPLICABLE
				)
			);
		} catch (error) {
			console.debug(error);
			return false;
		}
	},

	NewMakeMoves: async (
		game: number,
		player: number,
		moves: MoveData[]
	): Promise<boolean> => {
		try {
			await prisma.$transaction(async (ctx) => {
				// Check that the game exists by ID
				const gameState =
					await ctx.gameState.findUniqueOrThrow({
						where: {
							id: game
						},
						include: FullGameStateInclude
					});

				if (
					!gameState.players.some(
						(gamePlayer) =>
							gamePlayer.number === player
					)
				)
					throw new Error(
						`Invalid player number (${player}) for game #${game}`
					);

				// Perform each move inside of the transaction
				// If any fail, transactmoves will throw an error
				for (const move of moves) {
					await TransactMoves(
						{
							ctx: ctx,
							gameId: game,
							player: player
						},
						move
					);
				}
			});
		} catch (error) {
			console.log(
				"Unable to make moves in lobby #" +
					game +
					"."
			);
			console.log(error);

			return false;
		}

		return true;
	}
};

export default GameStateController;
