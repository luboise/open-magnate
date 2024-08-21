import {
	CloneArray,
	MapBackgroundTile
} from "../../../backend/src/utils";
import {
	IsConnecting,
	IsEdge,
	IsMaxBound,
	IsMinBound
} from "../../MapData";
import { DirectionBools } from "../tiles/types";
import { Map2D, PartialMap2D } from "./types";

export function DecorateTile(
	map: PartialMap2D,
	partialTile: MapBackgroundTile | MapBackgroundTile
): MapBackgroundTile {
	const maxX = map.length - 1;
	const maxY = map[0].length - 1;

	const x = partialTile.pos.x;
	const y = partialTile.pos.y;

	const edges: DirectionBools = {
		north:
			IsEdge(partialTile.pos.x) &&
			IsEdge(partialTile.pos.y),
		south:
			IsEdge(partialTile.pos.y + 1) &&
			IsEdge(partialTile.pos.y),
		east:
			IsEdge(partialTile.pos.x + 1) &&
			IsEdge(partialTile.pos.x),
		west:
			IsEdge(partialTile.pos.x - 1) &&
			IsEdge(partialTile.pos.x)
	};

	const extraDetails =
		partialTile.tileType === "ROAD"
			? {
				adjacentRoads: {
					north:
						(!IsMinBound(y) &&
							y > 0 &&
							map[x][y - 1].tileType ===
							"ROAD") ||
						IsConnecting(x, y - 1),
					south:
						(!IsMaxBound(y) &&
							y < maxY &&
							map[x][y + 1].tileType ===
							"ROAD") ||
						IsConnecting(x, y + 1),
					east:
						(!IsMaxBound(x) &&
							x < maxX &&
							map[x + 1][y].tileType ===
							"ROAD") ||
						IsConnecting(
							partialTile.pos.x + 1,
							partialTile.pos.y
						),
					west:
						(!IsMinBound(x) &&
							x > 0 &&
							map[x - 1][y].tileType ===
							"ROAD") ||
						IsConnecting(
							partialTile.pos.x - 1,
							partialTile.pos.y
						)
				}
			}
			: {};

	return {
		...partialTile,
		//	pieceEdges: edges,
		...extraDetails
	};
}

export function addMapDetails(
	baseMap: PartialMap2D
): Map2D {
	const newMap = CloneArray(baseMap) as Map2D;

	// const newMap = new2DArray<MapTileData>(
	// 	baseMap.length,
	// 	baseMap[0].length
	// );
	const maxX = baseMap.length - 1;

	// function test(y, maxy, )
	// Since the data is in column major order, iterate Y first
	for (let x = 0; x <= maxX; x++) {
		const maxY = newMap[x].length - 1;

		for (let y = 0; y <= maxY; y++) {
			newMap[x][y] = DecorateTile(baseMap, {
				...newMap[x][y]
				// pieceEdges: edges
			});
			continue;
		}
	}

	return newMap;
}
