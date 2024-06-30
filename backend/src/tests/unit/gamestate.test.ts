import GameStateController from "../../database/controller/gamestate.controller";
import { GetTransposed } from "../../utils";

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

describe("Util function tests", () => {
	describe("TransposeArray()", () => {
		test("TransposeArray correctly transposes square matrices", () => {
			const array: number[][] = [
				[1, 2, 3, 4, 5],
				[6, 7, 8, 9, 10],
				[11, 12, 13, 14, 15],
				[16, 17, 18, 19, 20],
				[21, 22, 23, 24, 25]
			];

			const transposed = GetTransposed(array);

			expect(transposed).toBeTruthy();
			expect(array[1][3]).toEqual(transposed[3][1]);
		});
		test("TransposeArray correctly transposes non-square matrices", () => {
			const array: number[][] = [
				[1, 2, 3],
				[6, 7, 8],
				[11, 12, 13],
				[16, 17, 18],
				[21, 22, 23]
			];

			const transposed = GetTransposed(array);

			expect(transposed).toBeTruthy();
			expect(array[0][2]).toEqual(transposed[2][0]);
			expect(array[4][2]).toEqual(transposed[2][4]);
		});
	});
});

