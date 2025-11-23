import {
	CountEmptySlots,
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	PLAYER_DEFAULTS
} from "../../../../shared";
import { MoveData } from "../../../../shared/Moves";
import { GetTransposed } from "../../../../shared/area/AreaUtils";
import { GetEmployeeTreeOrThrow } from "../../../../shared/employees/EmployeeStructure";
import { MapStringChar } from "../../../../shared/map/parsing/types";
import { parseTurnOrder } from "../../../../shared/views/GameStateViews";
import { TransactMove as TransactMoves } from "../../game/HandleMove";
import {
	MAP_PIECES,
	createMapString
} from "../../game/MapPieces";
import { TransactionInfo } from "../../utils";

import {
	HouseCreateManyGameInput,
	READY_STATUS,
	TURN_PROGRESS,
	prisma
} from "../datasource";

import GameStateRepository from "../repository/gamestate.repository";
import {
	FullGameState,
	FullGameStateInclude,
	FullLobby
} from "./includes";

export function copyArray<T>(
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
	): [mapString: string, HouseCreateManyGameInput[]] => {
		const defaults = PLAYER_DEFAULTS[playerCount];

		if (!defaults)
			throw new Error("Invalid player count");

		const houses: HouseCreateManyGameInput[] = [];

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

				const transactionMoves: TransactionInfo[] =
					[];

				// Perform each move inside of the transaction
				// If any fail, transactmoves will throw an error
				for (const move of moves) {
					await TransactMoves(
						{
							ctx: ctx,
							gameId: game,
							currentTurn:
								gameState.currentTurn,
							player: player,
							transactionInfo:
								transactionMoves
						},
						move
					);
				}
				console.log(
					"Transaction Moves: ",
					transactionMoves
				);
			});
		} catch (error) {
			console.error(error);
			console.error(
				`GamestateController: Unable to make moves in lobby #${game}. See the error above for details.`
			);

			return false;
		}

		return true;
	}
};

export function getTurnOrder(
	game: FullGameState
): number[] {
	if (game.turnProgress === "TURN_ORDER_SELECTION")
		return getTurnOrderPickOrder(game);

	const turnOrder = parseTurnOrder(game.oldTurnOrder);
	if (turnOrder.some((p) => p === null))
		throw new Error(
			`Null found in turn order for lobby #${game.id}`
		);
	return turnOrder as number[];
}

export function getCurrentPlayer(
	game: FullGameState
): number | null {
	if (
		game.turnProgress === "RESTRUCTURING" ||
		game.turnProgress === "SALARY_PAYOUTS"
	)
		return null;

	if (game.turnProgress === "TURN_ORDER_SELECTION") {
		return getTurnOrderSelectionCurrentPlayer(game);
	}

	const turnOrder = parseTurnOrder(game.turnOrder);
	for (const playerNumber of turnOrder) {
		if (playerNumber === null)
			throw new Error(
				`Null player found outside of turn order selection in lobby #${game.id}`
			);
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

export default GameStateController;
