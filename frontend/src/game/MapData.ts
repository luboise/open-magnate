export enum TileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD",

	HOUSE = "HOUSE",

	LEMONADE = "LEMONADE",
	COLA = "COLA",
	BEER = "BEER"
}

export type MapTileData = {
	type: TileType;
	data?: any;
};

export type RoadAdjacencyType = {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
};

export type MapPieceData = Array<Array<MapTileData>>;

const MAP_PIECE_WIDTH = 5;
const MAP_PIECE_HEIGHT = 5;
const MAP_PIECE_SIZE = MAP_PIECE_WIDTH * MAP_PIECE_HEIGHT;

const CONVERSION_MAP: Record<string, MapTileData> = {
	X: { type: TileType.EMPTY },

	R: { type: TileType.ROAD },
	H: { type: TileType.HOUSE },

	L: { type: TileType.LEMONADE },
	C: { type: TileType.COLA },
	B: { type: TileType.BEER }
};

export function parseMapPiece(
	mapString: string
): MapPieceData | null {
	// const initial: MapPiece = [[]];

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

		const items: MapPieceData = [[], [], [], [], []];

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
					...CONVERSION_MAP[char]
				};

				// function isTileExit(
				// 	row: number,
				// 	col: number
				// ): RoadAdjacencyType {
				// 	const x = {
				// 		north:
				// 			row === 0 &&
				// 			col ===
				// 				Math.floor(
				// 					MAP_PIECE_WIDTH / 2
				// 				),
				// 		south:
				// 			row === MAP_PIECE_HEIGHT - 1 &&
				// 			col ===
				// 				Math.floor(
				// 					MAP_PIECE_WIDTH / 2
				// 				),
				// 		east:
				// 			col === MAP_PIECE_WIDTH - 1 &&
				// 			row ===
				// 				Math.floor(
				// 					MAP_PIECE_HEIGHT / 2
				// 				),
				// 		west:
				// 			col === 0 &&
				// 			row ===
				// 				Math.floor(
				// 					MAP_PIECE_HEIGHT / 2
				// 				)
				// 	};
				// 	return x;
				// }

				// if (char === "R") {
				// 	const dic = isTileExit(row, col);

				// 	console.debug(
				// 		`row: ${row}  col: ${col}  `,
				// 		dic
				// 	);

				// 	parsedObject.data = {
				// 		north:
				// 			dic.north ||
				// 			(col > 0 &&
				// 				chars[row][col - 1] ===
				// 					"R"),
				// 		south:
				// 			dic.south ||
				// 			(col < MAP_PIECE_HEIGHT - 1 &&
				// 				chars[row][col + 1] ===
				// 					"R"),
				// 		east:
				// 			dic.east ||
				// 			(row > 0 &&
				// 				chars[row - 1][col] ===
				// 					"R"),
				// 		west:
				// 			dic.west ||
				// 			(row < MAP_PIECE_WIDTH - 1 &&
				// 				chars[row + 1][col] === "R")
				// 	} as RoadAdjacencyType;
				// }

				function isTopMiddle(
					row: number,
					col: number
				): boolean {
					return (
						row === 0 &&
						col ===
							Math.floor(MAP_PIECE_WIDTH / 2)
					);
				}

				function isBottomMiddle(
					row: number,
					col: number
				): boolean {
					return (
						row === MAP_PIECE_HEIGHT - 1 &&
						col ===
							Math.floor(MAP_PIECE_WIDTH / 2)
					);
				}

				function isRightMiddle(
					row: number,
					col: number
				): boolean {
					return (
						col === MAP_PIECE_WIDTH - 1 &&
						row ===
							Math.floor(MAP_PIECE_HEIGHT / 2)
					);
				}

				function isLeftMiddle(
					row: number,
					col: number
				): boolean {
					return (
						col === 0 &&
						row ===
							Math.floor(MAP_PIECE_HEIGHT / 2)
					);
				}

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

				items[row][col] = parsedObject;

				// console.debug(
				// 	"value: ",
				// 	CONVERSION_MAP[char]
				// );
			}
		}

		return items;
	} catch (error) {
		console.error(error);
	}

	return null;
}
