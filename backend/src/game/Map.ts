import { CHAR_TO_MAP_TILE_CONVERTER } from "../../../shared/MapData";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_SIZE,
	MAP_PIECE_WIDTH,
	MapPieceData,
	MapTileData,
	RoadAdjacencyType,
	new2DArray
} from "../utils";

export function translateMapTile(
	tile: MapTileData,
	xPieces: number,
	yPieces: number
) {
	tile.x += xPieces * MAP_PIECE_WIDTH;
	tile.y += yPieces * MAP_PIECE_HEIGHT;
	return tile;
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

export function parseMapChar(
	char: string,
	x: number,
	y: number
): MapTileData {
	// Handle invalid character
	if (!(char in CHAR_TO_MAP_TILE_CONVERTER)) {
		throw new Error(
			`Invalid char found: ${char}. Unable to construct map tile from char '${char}'.`
		);
	}

	const parsedObject = {
		...CHAR_TO_MAP_TILE_CONVERTER[char],
		x: x,
		y: y
	};

	if (char === "R") {
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
		} as RoadAdjacencyType;
	}

	return parsedObject as MapTileData;
}
export function parseMapPiece(
	mapString: string
): MapTileData[][] | null {
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

		const items: MapTileData[][] = new2DArray(
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

				items[row][col] =
					parsedObject as MapTileData;
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
