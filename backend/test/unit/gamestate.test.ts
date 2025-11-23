import {
	GetTransposed,
	IsAdjacent
} from "../../../shared/area/AreaUtils";
import GameStateController from "../../src/database/controller/gamestate.controller";
import { GetNewReserve } from "../../src/game/NewGameStructures";
import {
	Measurable,
	PLAYER_DEFAULTS
} from "../../src/utils";

import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH
} from "../../../shared/game/constants/MapConstants";

function testNewMap(playerCount: number) {
	const [map, houses] =
		GameStateController.NewMap(playerCount);
	expect(map).toBeTruthy();

	const defaults = PLAYER_DEFAULTS[playerCount];

	expect(defaults).toBeTruthy();
	expect(defaults.mapHeight).toBeGreaterThan(0);
	expect(defaults.mapWidth).toBeGreaterThan(0);

	const rows = map.split(";");

	const numRows: number =
		defaults.mapHeight * MAP_PIECE_HEIGHT;

	expect(numRows).toBeTruthy();
	expect(numRows).toBeGreaterThan(0);

	expect(rows).toHaveLength(numRows);

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
		expect(reserve).toBeTruthy();

		Object.keys(reserve).forEach((key) => {
			expect(
				Array.from(key).includes(",")
			).toBeFalsy();
		});
	});
});

// TODO: Fix this test
/**
describe("Testing createDetailedMapString()", () => {
	test("Standard test", () => {
		const map = "RRRRR;RRRRR;RRRRR;RRRRR;RRRRR";
		expect(
			createDetailedMapString(
				map,
				[],
				[],
				[
					{
						pos: { x: 0, y: 0 },
						demand: [],
						garden: null,
						priority: 1,
						demandLimit: 3
					}
				],
				[]
			)
		).toBeTruthy();
	});
});
**/
describe("Testing TileUtils", () => {
	describe("Testing IsAdjacent()", () => {
		const testHouse: Measurable = {
			pos: { x: 10, y: 10 },
			width: 2,
			height: 2
		} as const;

		const testMarketing: Measurable = {
			pos: { x: 9, y: 9 },
			width: 2,
			height: 1
		} as const;

		test("Check 2x1 with 2x2 left corner", () => {
			expect(
				IsAdjacent(testHouse, testMarketing)
			).toBeTruthy();
		});
		test("Check 1x2 with 2x2 left corner", () => {
			expect(
				IsAdjacent(testHouse, {
					...testMarketing,
					width: 1,
					height: 2
				})
			).toBeTruthy();
		});
		test("Check 1x1 with 2x2 left corner (should fail)", () => {
			expect(
				IsAdjacent(testHouse, {
					...testMarketing,
					width: 1,
					height: 1
				})
			).toBeFalsy();
		});
		test("Check right border non-adjacent (2x1 with 2x2)", () => {
			expect(
				IsAdjacent(testHouse, {
					...testMarketing,
					pos: {
						x: 12,
						y: 20
					}
				})
			).toBeFalsy();
		});
	});
});
