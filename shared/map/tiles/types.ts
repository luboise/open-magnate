import { Position } from "../../area/Units";
import { Map2D, PartialMap2D } from "../map_2d";
import { MapBackgroundTile } from "./background";
import { MapOverlayTile } from "./overlay";

export const MapBackgroundTileTypes = [
	"EMPTY",
	"ROAD",
	"HOUSE",
	"LEMONADE",
	"COLA",
	"BEER"
];
export type MapBackgroundTileType =
	(typeof MapBackgroundTileTypes)[number];

export const MapOverlayTileTypes = [
	"HOUSE",
	"MARKETING",
	"RESTAURANT"
];
export type MapOverlayTileType =
	(typeof MapOverlayTileTypes)[number];

export type MapAnyTileType =
	| MapBackgroundTileType
	| MapOverlayTileType;

export interface AbstractMapTileInterface {
	// Made concrete by sub-interfaces
	level: "BACKGROUND" | "OVERLAY";
	tileType: MapAnyTileType;

	// Always kept
	pos: Position;
}

export type MapAnyTile = MapBackgroundTile | MapOverlayTile;

export type RotationAmount = 0 | 90 | 180 | 270;

export type MapPieceData = {
	id: number;
	xOffset: number;
	yOffset: number;
	tiles: PartialMap2D | Map2D;
};

export type DirectionBools = {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
};
