import { MapPiece } from ".";
import { Position } from "./area";
import { HouseTile } from "./tiles/HouseTile";

describe("Map piece houses are rotated correctly.", () => {
	test("New game creates a valid game", () => {
		const mapPiece: MapPiece = {
			tiles: [HouseTile.create(Position(0, 0), 1)]
		};

		MapPiece.rotate(mapPiece, 90);
		expect(mapPiece.tiles[0].position).toStrictEqual(
			Position(3, 0)
		);

		MapPiece.rotate(mapPiece, 90);
		expect(mapPiece.tiles[0].position).toStrictEqual(
			Position(3, 3)
		);

		MapPiece.rotate(mapPiece, 90);
		expect(mapPiece.tiles[0].position).toStrictEqual(
			Position(0, 3)
		);
	});
});
