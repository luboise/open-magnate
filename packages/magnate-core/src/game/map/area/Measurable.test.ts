import { Measurable } from ".";

const TEST_HOUSE_1: Measurable = {
	pos: {
		x: 3,
		y: 13
	},
	width: 2,
	height: 2
} as const;

const TEST_HOUSE_2: Measurable = {
	pos: {
		x: 1,
		y: 8
	},
	width: 2,
	height: 2
} as const;

const TEST_BILLBOARD_1: Measurable = {
	pos: {
		x: TEST_HOUSE_2.pos.x + 2,
		y: TEST_HOUSE_2.pos.y
	},
	width: 1,
	height: 1
} as const;

describe("Testing isAdjacent", () => {
	describe("Testing billboards", () => {
		test("Billboards get adjacent houses", () => {
			const m2: Measurable = {
				pos: {
					x: 1,
					y: 13
				},
				width: 2,
				height: 1
			};

			expect(
				Measurable.areAdjacent(TEST_HOUSE_1, m2)
			).toBeTruthy();
		});
		test("Billboard 15 gets adjacent house to its left", () => {
			expect(
				Measurable.areAdjacent(
					TEST_HOUSE_2,
					TEST_BILLBOARD_1
				)
			).toBeTruthy();
		});
		test("Billboard 15 gets adjacent bottom house to its left", () => {
			const billboard: Measurable = {
				pos: {
					x: TEST_HOUSE_2.pos.x + 2,
					y: TEST_HOUSE_2.pos.y + 1
				},
				width: 1,
				height: 1
			};

			expect(
				Measurable.areAdjacent(
					TEST_HOUSE_2,
					billboard
				)
			).toBeTruthy();
		});
		test("Billboard 15 should fail when too high (top-right)", () => {
			const billboard: Measurable = {
				pos: {
					x: TEST_HOUSE_2.pos.x + 2,
					y: TEST_HOUSE_2.pos.y - 1
				},
				width: 1,
				height: 1
			};

			expect(
				Measurable.areAdjacent(
					TEST_HOUSE_2,
					billboard
				)
			).toBeFalsy();
		});
		test("Billboard 15 should fail when too low (bottom-right)", () => {
			const billboard: Measurable = {
				pos: {
					x: TEST_HOUSE_2.pos.x + 2,
					y: TEST_HOUSE_2.pos.y + 2
				},
				width: 1,
				height: 1
			};

			expect(
				Measurable.areAdjacent(
					TEST_HOUSE_2,
					billboard
				)
			).toBeFalsy();
		});
	});
});
