import {
	DirectionBools,
	MapAnyTileType,
	MapBackgroundTileInterface
} from "../../";

export const ROAD_TERMINATORS: MapAnyTileType[] = [
	"ROAD",
	"EMPTY"
];

export interface RoadTile
	extends MapBackgroundTileInterface {
	tileType: "ROAD";
	adjacentRoads: DirectionBools;
}
