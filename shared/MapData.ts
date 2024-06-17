import { MapTileData } from "../frontend/src/utils";

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

export type RoadAdjacencyType = {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
};

export type MapPieceData = {
	id: number;
	tiles: Array<Array<MapTileData>>;
};
