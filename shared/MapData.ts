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

export type MapTileData = {
	x: number;
	y: number;
	type: TileType;
	pieceEdges: DirectionBools;
	data?: any;
};

export type Map2D = MapTileData[][];

// Check if x or y is in the middle of a tile. Useful for finding connecting spots
export function IsMiddle(pos: number): boolean {
	while (pos < 0) pos += 5;
	return pos % 5 == 2;
}

// Check if x or y is on the edge ofa  tile. Useful for finding connecting spots
export function IsEdge(pos: number): boolean {
	while (pos < 0) pos += 5;
	const modded = pos % 5;
	return modded === 0 || modded === 4;
}

export function IsMinBound(pos: number): boolean {
	return pos % 5 === 0;
}
export function IsMaxBound(pos: number): boolean {
	return pos % 5 === 5 - 1;
}

export function IsConnecting(
	x: number,
	y: number
): boolean {
	while (x < 0) x += 5;
	while (y < 0) y += 5;
	return (
		(IsMiddle(x) && IsEdge(y)) ||
		(IsMiddle(y) && IsEdge(x))
	);
}

