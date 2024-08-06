import { new2DArray } from "../backend/src/utils";
import {
	CHAR_TO_MAP_TILE_CONVERTER,
	PartialMap2D,
	PartialMapTileData
} from "./MapData";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_SIZE,
	MAP_PIECE_WIDTH,
	MapPieceData,
	MapTileData
} from "./MapTiles/MapPieceTiles";
import { TileType } from "./MapTiles/Tile";

export function translateMapTile(
	tile: MapTileData,
	xPieces: number,
	yPieces: number
) {
	tile.pos.x += xPieces * MAP_PIECE_WIDTH;
	tile.pos.y += yPieces * MAP_PIECE_HEIGHT;
	return tile;
}

export function parseMapChar(
	char: string,
	x: number,
	y: number
): PartialMapTileData {
	// Handle invalid character
	if (!(char in CHAR_TO_MAP_TILE_CONVERTER)) {
		throw new Error(
			`Invalid char found: ${char}. Unable to construct map tile from char '${char}'.`
		);
	}

	const parsedObject: PartialMapTileData = {
		...CHAR_TO_MAP_TILE_CONVERTER[char],
		pos: {
			x: x,
			y: y
		},
		width: 1,
		height: 1,
		rotation: 0
	};

	if (parsedObject.tileType === TileType.ROAD) {
		parsedObject.data = {
			// north:
			// 	isTopMiddle(row, col) ||
			// 	(row > 0 && chars[row - 1][col] === "R"),
			// south:
			// 	isBottomMiddle(row, col) ||
			// 	(row < MAP_PIECE_HEIGHT - 1 &&
			// 		chars[row + 1][col] === "R"),
			// east:
			// 	isRightMiddle(row, col) ||
			// 	(col < MAP_PIECE_WIDTH - 1 &&
			// 		chars[row][col + 1] === "R"),
			// west:
			// 	isLeftMiddle(row, col) ||
			// 	(col > 0 && chars[row][col - 1] === "R")
			north: true,
			south: true,
			east: true,
			west: true
		};
	}

	return parsedObject;
}
export function parseMapPiece(
	mapString: string
): PartialMap2D | null {
	try {
		// Remove spaces and check for valid length
		if (
			mapString.replace(/\s/g, "").length !==
			MAP_PIECE_SIZE
		) {
			throw new Error(
				`Invalid map string length. Expected ${MAP_PIECE_SIZE}, got ${mapString.length}.`
			);
		}

		const chars = mapString
			.split(" ")
			.map((row) => Array.from(row));

		const items: PartialMap2D = new2DArray(
			MAP_PIECE_HEIGHT,
			MAP_PIECE_WIDTH
		);

		for (let col = 0; col < MAP_PIECE_WIDTH; col++) {
			for (
				let row = 0;
				row < MAP_PIECE_HEIGHT;
				row++
			) {
				const char: string = chars[row][col];

				const parsedObject = parseMapChar(
					char,
					col,
					row
				);

				items[row][col] = parsedObject;
			}
		}

		return items;
	} catch (error) {
		console.error(error);
	}

	return null;
}

export function parseMap(
	mapString: string
): MapPieceData[] {
	let pieces: MapPieceData[] = [];

	const piecesRows = mapString.split("]");
	let counter = 1;

	piecesRows.forEach((row, rowIndex) => {
		row.split(";").forEach((pieceString, colIndex) => {
			pieces.push({
				id: counter++,
				xOffset: colIndex,
				yOffset: rowIndex,
				tiles: parseMapPiece(pieceString) ?? []
			});
		});
	});

	return pieces.some(
		(piece) => piece === null || !piece.tiles.length
	)
		? []
		: pieces;
}

