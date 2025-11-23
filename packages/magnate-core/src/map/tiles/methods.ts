// Function that checks if a given tile is an overlay tile

import { MapBackgroundTile } from "./background";
import { MapOverlayTile } from "./overlay";
import {
	MapAnyTile,
	MapBackgroundTileTypes,
	MapOverlayTileTypes
} from "./types";

export function IsOverlayTile(
	tile: MapAnyTile
): tile is MapOverlayTile {
	return MapOverlayTileTypes.includes(tile.tileType);
}

export function IsBackgroundTile(
	tile: MapAnyTile
): tile is MapBackgroundTile {
	return MapBackgroundTileTypes.includes(tile.tileType);
}
