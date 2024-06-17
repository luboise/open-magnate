import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_SIZE,
	MAP_PIECE_WIDTH,
	MapPieceData,
	MapTileData,
	RoadAdjacencyType,
	TileType,
	new2DArray
} from "../utils";

const CONVERSION_MAP: Record<
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

export function parseMapPiece(
	mapString: string
): MapPieceData | null {
	function isTopMiddle(
		row: number,
		col: number
	): boolean {
		return (
			row === 0 &&
			col === Math.floor(MAP_PIECE_WIDTH / 2)
		);
	}

	function isBottomMiddle(
		row: number,
		col: number
	): boolean {
		return (
			row === MAP_PIECE_HEIGHT - 1 &&
			col === Math.floor(MAP_PIECE_WIDTH / 2)
		);
	}

	function isRightMiddle(
		row: number,
		col: number
	): boolean {
		return (
			col === MAP_PIECE_WIDTH - 1 &&
			row === Math.floor(MAP_PIECE_HEIGHT / 2)
		);
	}

	function isLeftMiddle(
		row: number,
		col: number
	): boolean {
		return (
			col === 0 &&
			row === Math.floor(MAP_PIECE_HEIGHT / 2)
		);
	}

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

		const items: MapPieceData = new2DArray(
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

				// Handle invalid character
				if (!(char in CONVERSION_MAP)) {
					throw new Error(
						`Invalid char found: ${char}. Unable to construct map piece from string ${mapString}.`
					);
				}

				const parsedObject = {
					...CONVERSION_MAP[char],
					x: col * MAP_PIECE_SIZE,
					y: row * MAP_PIECE_SIZE
				};

				if (char === "R") {
					parsedObject.data = {
						north:
							isTopMiddle(row, col) ||
							(row > 0 &&
								chars[row - 1][col] ===
									"R"),
						south:
							isBottomMiddle(row, col) ||
							(row < MAP_PIECE_HEIGHT - 1 &&
								chars[row + 1][col] ===
									"R"),
						east:
							isRightMiddle(row, col) ||
							(col < MAP_PIECE_WIDTH - 1 &&
								chars[row][col + 1] ===
									"R"),
						west:
							isLeftMiddle(row, col) ||
							(col > 0 &&
								chars[row][col - 1] === "R")
					} as RoadAdjacencyType;
				}

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
