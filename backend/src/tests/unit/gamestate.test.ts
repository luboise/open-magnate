import GameStateController from "../../database/controller/gamestate.controller";

describe("Gamestate Unit Tests", () => {
	describe("Creating New Gamestates", () => {
		test("Expect NewMap() to return a valid map and set of houses", async () => {
			const [map, houses] =
				GameStateController.NewMap(2);
			expect(map).toBeTruthy();

			const rows = map.split(";");
			expect(rows).toHaveLength(15);
			rows.forEach((row) => {
				expect(row).toBeTruthy();
				expect(row).toHaveLength(15);
			});

			expect(houses).toBeTruthy();
			expect(houses.length).toBeGreaterThanOrEqual(3);
		});
	});
});
