import GameStateController from "../../database/controller/gamestate.controller";

describe("Gamestate Unit Tests", () => {
	describe("Creating New Gamestates", () => {
		test("Expect NewMap() to return a valid map and set of houses", async () => {
			const [map, houses] =
				GameStateController.NewMap(2);
			expect(map).toBeTruthy();

			console.log(map);

			const rows = map.split(";");
			expect(rows).toHaveLength(15);
			expect(
				Array.from(map).reduce<number>(
					(acc, cur) =>
						acc + (cur === "X" ? 1 : 0),
					0
				)
			).toBeLessThan(225);
			rows.forEach((row) => {
				expect(row).toBeTruthy();
				expect(row).toHaveLength(15);
			});

			expect(houses).toBeTruthy();
			expect(houses.length).toBeGreaterThanOrEqual(3);
		});
	});
});
