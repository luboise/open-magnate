import { ENTRANCE_CORNER } from "../backend/src/dataViews";
import {
	BaseMapTileData,
	MapTileData,
	TileType
} from "./MapTiles/MapPieceTiles";

export const CHAR_TO_MAP_TILE_CONVERTER: Record<
	string,
	{ tileType: TileType }
> = {
	X: { tileType: TileType.EMPTY },

	R: { tileType: TileType.ROAD },
	H: { tileType: TileType.HOUSE },

	L: { tileType: TileType.LEMONADE },
	C: { tileType: TileType.COLA },
	B: { tileType: TileType.BEER }
} as const;

// export type PartialMapTileData = Omit<
// 	MapTileData,
// 	"pieceEdges"
// >;
export type PartialMapTileData = Omit<
	BaseMapTileData,
	"pieceEdges"
>;

// export type MapTileData = {
// 	x: number;
// 	y: number;
// 	type: TileType;
// 	pieceEdges: DirectionBools;
// 	data?: any;
// };

export type PartialMap2D = PartialMapTileData[][];
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

export function rotateEntranceCorner(
	corner: ENTRANCE_CORNER,
	inverted: boolean = false
): ENTRANCE_CORNER {
	switch (corner) {
		case "TOPLEFT":
			return inverted ? "BOTTOMLEFT" : "TOPRIGHT";
		case "TOPRIGHT":
			return inverted ? "TOPLEFT" : "BOTTOMRIGHT";
		case "BOTTOMRIGHT":
			return inverted ? "TOPRIGHT" : "BOTTOMLEFT";
		case "BOTTOMLEFT":
			return inverted ? "BOTTOMRIGHT" : "TOPLEFT";
	}
}
// export function RotateMapPiece(
// 	piece: MapPieceData,
// 	degrees: 0 | 90 | 180 | 270
// ): MapPieceData {
// 	if (degrees === 0) {
// 		return piece;
// 	}
// 	if (degrees === 90) {
// 		return piece.map((row) =>
// 			row.map((tile, i) => {
// 				return {
// 					x: MAP_PIECE_HEIGHT - 1 - tile.y,
// 					y: tile.x,
// 					type: tile.type
// 				};
// 			})
// 		);
// 	}
// 	if (degrees === 180) {
// 		return piece.map((row) =>
// 			row.map((tile, i) => {
// 				return {
// 					x: MAP_PIECE_WIDTH - 1 - tile.x,
// 					y: MAP_PIECE_HEIGHT - 1 - tile.y,
// 					type: tile.type
// 				};
// 			})
// 		);
// 	}
// }
// function isTopMiddle(row: number, col: number): boolean {
// 	return (
// 		row === 0 && col === Math.floor(MAP_PIECE_WIDTH / 2)
// 	);
// }
// function isBottomMiddle(row: number, col: number): boolean {
// 	return (
// 		row === MAP_PIECE_HEIGHT - 1 &&
// 		col === Math.floor(MAP_PIECE_WIDTH / 2)
// 	);
// }
// function isRightMiddle(row: number, col: number): boolean {
// 	return (
// 		col === MAP_PIECE_WIDTH - 1 &&
// 		row === Math.floor(MAP_PIECE_HEIGHT / 2)
// 	);
// }
// function isLeftMiddle(row: number, col: number): boolean {
// 	return (
// 		col === 0 &&
// 		row === Math.floor(MAP_PIECE_HEIGHT / 2)
// 	);
// }

