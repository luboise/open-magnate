import { Pathfinding } from "../../src/utils";
import { PATHFINDING_TEST_MAP } from "./extra";

describe("Pathfinding Tests", () => {
	describe("Regular Tests", () => {
		test("Expect FindPath() to return a valid map and set of houses (2 players)", async () => {
			const result = Pathfinding.FindPath(
				PATHFINDING_TEST_MAP,
				{ x: 10, y: 8 },
				{ x: 4, y: 12 }
			);
			expect(result).toBeTruthy();
		});
	});
});
