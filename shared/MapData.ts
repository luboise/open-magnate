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
	xOffset: number;
	yOffset: number;
	tiles: Array<Array<MapTileData>>;
};
export const CHAR_TO_MAP_TILE_CONVERTER: Record<
	string,
	Partial<MapTileData>
> = {
	X: { type: TileType.EMPTY },

	R: { type: TileType.ROAD },
	H: { type: TileType.HOUSE },

	L: { type: TileType.LEMONADE },
	C: { type: TileType.COLA },
	B: { type: TileType.BEER }
};
