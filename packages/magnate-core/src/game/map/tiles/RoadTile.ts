import { BaseMapTile } from "..";
import { DirectionSet } from "../area";

export interface RoadTile
	extends BaseMapTile {
	tileType: "ROAD";
	adjacentRoads: DirectionSet;
}
