import { GameStatus } from ".";
import { Player } from "../Player";
import {
	GameState,
	NewGameParams,
	newGame
} from "./GameState";
import { MoveType, applyMoveToGamestate } from "./Moves";

describe("Test GameState", () => {
	test("New game creates a valid game", () => {
		const params: NewGameParams = { playerCount: 2 };
		const ng = newGame(params);

		/// A new game should have the correct number of players
		expect(ng.players.length).toEqual(2);

		/// A new game should have money in the reserve
		expect(ng.bankReserve).toBeGreaterThan(0);

		/// A new game should have at least one house
		expect(
			ng.map.tiles.some(
				(tile) => tile.tileType == "HOUSE"
			)
		).toBeTruthy();

		expect(ng.marketingTiles.length).toBeGreaterThan(0);

		expect(ng.turnOrder.length).toStrictEqual(
			params.playerCount
		);

		/// A new game should have all players unready at the beginning
		expect(
			ng.readyStatuses.every((val) => !val)
		).toBeTruthy();

		const nextMove = GameState.nextMove(ng);

		expect(nextMove).toBeTruthy();
		expect(nextMove!.moveType).toStrictEqual<MoveType>(
			MoveType.PLACE_RESTAURANT
		);
	});
});

describe("Test tile placement", () => {
	test("Test placing restaurant", () => {
		let clone: GameState | string =
			GameState.clone(TEST_GAMESTATE);

		clone = applyMoveToGamestate(
			GameState.clone(clone),
			0,
			{
				moveType: MoveType.PLACE_RESTAURANT,
				x: 3,
				y: 0,
				entrance: "TOPLEFT"
			}
		);

		// Expect not error
		expect(typeof clone).not.toStrictEqual("string");

		expect(
			(clone as GameState).readyStatuses
		).toStrictEqual([true, false]);
	});
});

describe("Test GameState.clone()", () => {
	test("Clone test gamestate", () => {
		expect(
			GameState.clone(TEST_GAMESTATE)
		).toStrictEqual(TEST_GAMESTATE);
	});
});

describe("Test bank reserve card logic", () => {
	test("Test player at index 1 selects first", () => {
		let clone: GameState | string =
			GameState.clone(TEST_GAMESTATE);

		clone.status = "SELECTING_BANK_RESERVE";

		clone = applyMoveToGamestate(clone, 1, {
			moveType: MoveType.SELECT_BANK_RESERVE,
			reserveAmount: 200
		});

		// Expect not error
		expect(typeof clone).not.toStrictEqual("string");

		expect(
			(clone as GameState).readyStatuses
		).toStrictEqual([false, true]);

		clone = applyMoveToGamestate(
			clone as GameState,
			0,
			{
				moveType: MoveType.SELECT_BANK_RESERVE,
				reserveAmount: 200
			}
		);

		expect(typeof clone).not.toStrictEqual("string");
		expect(
			(clone as GameState).readyStatuses.every(
				(v) => !v
			)
		).toBeTruthy();
		expect(
			(clone as GameState).status
		).toStrictEqual<GameStatus>("WORKING_NINE_TO_FIVE");
	});
});

const TEST_GAMESTATE: GameState = {
	currentTurn: 0,
	cardReserve: {
		food_basic: 12,
		burger_1: 6,
		burger_2: 1,
		pizza_1: 6,
		pizza_2: 1,
		drink_boy: 12,
		drink_cart: 6,
		drink_truck: 6,
		drink_zeppelin: 1,
		mgmt_1: 18,
		mgmt_2: 12,
		mgmt_3: 6,
		mgmt_4: 6,
		mgmt_5: 1,
		market_1: 12,
		market_2: 6,
		market_3: 6,
		market_4: 1,
		waitress: 12,
		trainer: 12,
		coach: 6,
		guru: 1,
		recruiting_girl: 12,
		recruiting_manager: 6,
		hr_director: 1
	},
	players: [Player.create(0), Player.create(1)],
	map: {
		width: 15,
		height: 15,
		tiles: [
			{
				drinkType: "LEMONADE",
				position: {
					x: 0,
					y: 1
				},
				tileType: "DRINK",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				drinkType: "BEER",
				position: {
					x: 3,
					y: 4
				},
				tileType: "DRINK",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 0
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 1
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 0,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 1,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 3,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 4,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 3
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 6,
					y: 2
				},
				houseNumber: 18,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 9,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 8,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 6,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 5,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 9,
					y: 3
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 5,
					y: 3
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 9,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 5,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 13,
					y: 0
				},
				houseNumber: 4,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 0
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 1
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 11,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 13,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 2
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 3
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 4
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 0,
					y: 5
				},
				houseNumber: 12,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 6
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 0,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 1,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 3,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 4,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 8
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				drinkType: "COLA",
				position: {
					x: 8,
					y: 5
				},
				tileType: "DRINK",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				drinkType: "BEER",
				position: {
					x: 5,
					y: 5
				},
				tileType: "DRINK",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 6
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 5,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 6,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 8,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 9,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 8
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 6
				},
				houseNumber: 5,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 11,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 13,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 5
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 6
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 6
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 7
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 8
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 8
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 11,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 13,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 9
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 0,
					y: 10
				},
				houseNumber: 15,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 14
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 13
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 4,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 3,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 2,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 1,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 0,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				drinkType: "LEMONADE",
				position: {
					x: 6,
					y: 11
				},
				tileType: "DRINK",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 10
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 11
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 5,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 6,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 8,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 9,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 13
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 7,
					y: 14
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 10,
					y: 11
				},
				houseNumber: 13,
				tileType: "HOUSE",
				demand: {
					BURGER: 0,
					PIZZA: 0,
					LEMONADE: 0,
					BEER: 0,
					COLA: 0
				},
				width: 2,
				height: 2,
				rotation: 0
			},
			{
				position: {
					x: 14,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 13,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 10
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 11
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 12
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 13
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			},
			{
				position: {
					x: 12,
					y: 14
				},
				adjacentRoads: {
					east: true,
					north: true,
					south: true,
					west: true
				},
				tileType: "ROAD",
				width: 1,
				height: 1,
				rotation: 0
			}
		]
	},
	marketingTiles: [
		{
			tileType: "MARKETING",
			marketingType: "RADIO",
			tileNumber: 1,
			rotation: 0,
			width: 1,
			height: 1,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			tileType: "MARKETING",
			marketingType: "RADIO",
			tileNumber: 2,
			rotation: 0,
			width: 1,
			height: 1,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			tileType: "MARKETING",
			marketingType: "RADIO",
			tileNumber: 3,
			rotation: 0,
			width: 1,
			height: 1,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			tileType: "MARKETING",
			marketingType: "PLANE",
			tileNumber: 4,
			width: 2,
			height: 1,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "PLANE",
			tileNumber: 5,
			width: 3,
			height: 2,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "PLANE",
			tileNumber: 6,
			width: 4,
			height: 2,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "MAILBOX",
			tileNumber: 7,
			width: 2,
			height: 2,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "MAILBOX",
			tileNumber: 8,
			width: 2,
			height: 2,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "MAILBOX",
			tileNumber: 9,
			width: 1,
			height: 1,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "MAILBOX",
			tileNumber: 10,
			width: 1,
			height: 1,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "BILLBOARD",
			tileNumber: 11,
			width: 3,
			height: 2,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "BILLBOARD",
			tileNumber: 13,
			width: 3,
			height: 1,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		},
		{
			tileType: "MARKETING",
			marketingType: "BILLBOARD",
			tileNumber: 14,
			width: 2,
			height: 1,
			position: {
				x: 0,
				y: 0
			},
			rotation: 0
		}
	],
	bankReserve: 100,
	status: "PLACING_FIRST_RESTAURANTS",
	turnOrder: [0, 1],
	readyStatuses: [false, false]
} as const;
