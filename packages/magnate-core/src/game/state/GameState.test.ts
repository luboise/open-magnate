import { MoveType } from ".";
import {
	GameState,
	NewGameParams,
	newGame
} from "./GameState";

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
