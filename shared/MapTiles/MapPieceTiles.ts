import { Map2D, PartialMap2D } from "../MapData";
import { BaseTile } from "./Tile";

export interface BaseMapTileData extends BaseTile {
	tileType: TileType;
	pieceEdges: DirectionBools;
	data?: any;
}

export interface EmptyTile extends BaseMapTileData {
	tileType: TileType.EMPTY;
}

export interface RoadTile extends BaseMapTileData {
	tileType: TileType.ROAD;
	adjacentRoads: DirectionBools;
}

export interface ColaTile extends BaseMapTileData {
	tileType: TileType.COLA;
}

export interface LemonadeTile extends BaseMapTileData {
	tileType: TileType.LEMONADE;
}

export interface BeerTile extends BaseMapTileData {
	tileType: TileType.BEER;
}

export interface HouseTile extends BaseMapTileData {
	tileType: TileType.HOUSE;
}

export type MapTileData =
	| RoadTile
	| EmptyTile
	| ColaTile
	| LemonadeTile
	| BeerTile
	| HouseTile;

export const MAP_PIECE_WIDTH = 5;
export const MAP_PIECE_HEIGHT = 5;
export const MAP_PIECE_SIZE =
	MAP_PIECE_WIDTH * MAP_PIECE_HEIGHT;

export enum TileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD",

	HOUSE = "HOUSE",

	LEMONADE = "LEMONADE",
	COLA = "COLA",
	BEER = "BEER"
}

export const ROAD_TERMINATORS: TileType[] = [
	TileType.ROAD,
	TileType.EMPTY
];

export type DirectionBools = {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
};

export type MapPieceData = {
	id: number;
	xOffset: number;
	yOffset: number;
	tiles: PartialMap2D | Map2D;
};

