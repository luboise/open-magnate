import { BaseMapTile, GameMap, MapTile } from "..";
import { DirectionSet, Position } from "../area";

export type RoadType = "STANDARD" | "OVERPASS";

export interface RoadTile extends BaseMapTile {
	tileType: "ROAD";

	roadType: RoadType;

	width: 1;
	height: 1;
	rotation: 0;
}

export const RoadTile = {
	create(
		position: Position,
		roadType: RoadType = "STANDARD"
	): RoadTile {
		return {
			position,
			roadType: roadType,

			// Default params
			tileType: "ROAD",
			width: 1,
			height: 1,
			rotation: 0
		};
	},

	getDirectionSet(tile: RoadTile): DirectionSet {
		switch (tile.roadType) {
			case "STANDARD": {
				return {
					east: true,
					north: true,
					south: true,
					west: true
				};
			}
			case "OVERPASS": {
				return {
					east: false,
					west: false,
					north: true,
					south: true
				};
			}
			default:
				tile.roadType satisfies never;
		}

		return DirectionSet.create();
	},

	canConnectWithEmpty(
		roadTile: RoadTile,
		emptyPos: Position
	): boolean {
		return !Position.areOnSameBlock(
			roadTile.position,
			emptyPos
		);
	},

	canConnectWithTile(
		roadTile: RoadTile,
		tile: MapTile
	): boolean {
		switch (tile.tileType) {
			case "HOUSE":
			case "DRINK":
				return true;
			case "RESTAURANT":
				// TODO: Figure this out later
				return false;
			case "ROAD":
				return (
					MapTile.areOnSameBlock(
						roadTile,
						tile
					) ||
					RoadTile.canConnectWithEmpty(
						roadTile,
						tile.position
					)
				);
			case "MARKETING":
				return false;
			default:
				return tile satisfies never;
		}
	},

	getDirectionsWithReference(
		tile: RoadTile,
		gameMap: GameMap
	): DirectionSet {
		const ds: DirectionSet = DirectionSet.create();

		function canConnect(
			tile: RoadTile,
			offset: Position
		) {
			const offsetPos = Position.add(
				tile.position,
				offset
			);
			const offsetTile = GameMap.getTileAt(
				gameMap,
				offsetPos
			);
			return offsetTile === undefined
				? RoadTile.canConnectWithEmpty(
						tile,
						offsetPos
					) && MapTile.isAtBlockConnector(tile)
				: RoadTile.canConnectWithTile(
						tile,
						offsetTile
					);
		}

		ds.north = canConnect(tile, Position.create(0, -1));
		ds.south = canConnect(tile, Position.create(0, 1));
		ds.west = canConnect(tile, Position.create(-1, 0));
		ds.east = canConnect(tile, Position.create(1, 0));

		return ds;
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
						RoadTile.create(
							Position.create(x, y)
						)
					);
				}
			}
		}

		return tiles;
	}
};
