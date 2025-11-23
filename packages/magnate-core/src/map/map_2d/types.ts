import { MapStringChar } from "../parsing/types";
import {
	AbstractMapTileInterface,
	MapBackgroundTile
} from "../tiles";

export type UndetailedMap2D = MapStringChar[][];
export type PartialMap2D = AbstractMapTileInterface[][];
export type Map2D = MapBackgroundTile[][];
