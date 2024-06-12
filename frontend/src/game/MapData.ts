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

		const items = mapString.split(" ").map((row) =>
			Array.from(row).map((char) => {
				// Handle invalid character
				if (!(char in CONVERSION_MAP)) {
					throw new Error(
						`Invalid char found: ${char}. Unable to construct map piece from string ${mapString}.`
					);
				}

				const parsedObject = CONVERSION_MAP[char];

				if (char === "R") {
					parsedObject.data = {
						north: true,
						east: true,
						south: true,
						west: true
					} as RoadAdjacencyType;
				}

				// console.debug(
				// 	"value: ",
				// 	CONVERSION_MAP[char]
				// );

				return parsedObject;
			})
		);

		console.debug("items: ", items);

		return items;
	} catch (error) {
		console.debug(error);
	}

	return null;
}
