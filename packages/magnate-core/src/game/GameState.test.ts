import { NewGameParams, newGame } from "./GameState";

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
	});
});
