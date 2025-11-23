import {
	AbstractMapTileInterface,
	MapBackgroundTileType
} from "../types";
import { DrinkTile } from "./DrinkTiles";
import { EmptyTile } from "./EmptyTiles";
import { RoadTile } from "./RoadTiles";

export type MapBackgroundTile =
	| DrinkTile
	| EmptyTile
	| RoadTile;

export interface MapBackgroundTileInterface
	extends AbstractMapTileInterface {
	level: "BACKGROUND";
	tileType: MapBackgroundTileType;
}
