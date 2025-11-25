import { BaseMapTile } from "..";
import { DirectionSet, Position } from "../area";

export interface RoadTile extends BaseMapTile {
	tileType: "ROAD";
	adjacentRoads: DirectionSet;
	width: 1;
	height: 1;
	rotation: 0;
}

export const RoadTile = {
	create(
		position: Position,
		adjacentRoads: DirectionSet = {
			east: true,
			north: true,
			south: true,
			west: true
		}
	): RoadTile {
		return {
			position,
			adjacentRoads: { ...adjacentRoads },

			// Default params
			tileType: "ROAD",
			width: 1,
			height: 1,
			rotation: 0
		};
	},

	fromGridText(text: string): RoadTile[] {
		const rows = text.split(" ");
		if (
			rows.length != 5 ||
			rows.some((row) => row.length != 5)
		) {
			console.error(
				"Bad rows: ",
				rows,
				". Returning no road tiles."
			);
			return [];
		}

		const tiles: RoadTile[] = [];

		for (let y = 0; y < rows.length; y++) {
			const row = rows[y];

			for (let x = 0; x < row.length; x++) {
				if (row[x] == "R") {
					tiles.push(
						RoadTile.create(Position(x, y))
					);
				}
			}
		}

		return tiles;
	}
};
