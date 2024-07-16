import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	PLAYER_DEFAULTS
} from "../../../../shared";
import GameStateController from "../../database/controller/gamestate.controller";
import { GetNewReserve } from "../../game/NewGameStructures";
import { GetTransposed } from "../../utils";

function testNewMap(playerCount: number) {
	const [map, houses] =
		GameStateController.NewMap(playerCount);
	expect(map).toBeTruthy();

	const defaults = PLAYER_DEFAULTS[playerCount];

	const rows = map.split(";");
	expect(rows).toHaveLength(
		defaults.mapHeight * MAP_PIECE_HEIGHT
	);

	const firstColumn = rows[0].split("");
	expect(firstColumn).toHaveLength(
		defaults.mapWidth * MAP_PIECE_WIDTH
	);

	expect(
		Array.from(map).reduce<number>(
			(acc, cur) => acc + (cur === "X" ? 1 : 0),
			0
		)
	).toBeLessThan(
		MAP_PIECE_WIDTH *
			MAP_PIECE_HEIGHT *
			defaults.mapWidth *
			defaults.mapHeight
	);

	rows.forEach((row) => {
		expect(row).toBeTruthy();
		expect(row).toHaveLength(
			defaults.mapWidth * MAP_PIECE_WIDTH
		);
	});

	expect(houses).toBeTruthy();

	const vals = GetTransposed(
		map.split(";").map((row) => row.split(""))
	);

	houses.forEach((house) => {
		expect(vals[house.x][house.y]).toEqual("H");
		expect(vals[house.x + 1][house.y]).toEqual("H");
		expect(vals[house.x][house.y + 1]).toEqual("H");
		expect(vals[house.x + 1][house.y + 1]).toEqual("H");
	});
	expect(houses.length).toBeGreaterThanOrEqual(1);
}

describe("Creating Gamestates", () => {
	describe("Creating New Gamestates", () => {
		test("Expect NewMap() to return a valid map and set of houses (2 players)", async () => {
			testNewMap(2);
		});
		test("Expect NewMap() to return a valid map and set of houses (3 players)", async () => {
			testNewMap(3);
		});
		test("Expect NewMap() to return a valid map and set of houses (4 players)", async () => {
			testNewMap(4);
		});
		test("Expect NewMap() to return a valid map and set of houses (5 players)", async () => {
			testNewMap(5);
		});
	});
});

describe("Testing Arrays", () => {
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

describe("Testing GetNewReserve()", () => {
	test("Expect GetNewReserve() to return a valid reserve", () => {
		const reserve = GetNewReserve(2);
		console.log(reserve);

		expect(reserve).toBeTruthy();

		Object.keys(reserve).forEach((key) => {
			expect(
				Array.from(key).includes(",")
			).toBeFalsy();
		});
	});
});

