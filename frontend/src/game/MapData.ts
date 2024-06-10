export enum MapTileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD",

	HOUSE = "HOUSE",

	LEMONADE = "LEMONADE",
	COLA = "COLA",
	BEER = "BEER"
}

export type MapTileData = {
	type: MapTileType;
	data?: any;
};

export type MapPieceData = Array<Array<MapTileData>>;

const MAP_PIECE_WIDTH = 5;
const MAP_PIECE_HEIGHT = 5;
const MAP_PIECE_SIZE = MAP_PIECE_WIDTH * MAP_PIECE_HEIGHT;

const CONVERSION_MAP: Record<string, MapTileData> = {
	X: { type: MapTileType.EMPTY },

	R: { type: MapTileType.ROAD },
	H: { type: MapTileType.HOUSE },

	L: { type: MapTileType.LEMONADE },
	C: { type: MapTileType.COLA },
	B: { type: MapTileType.BEER }
};

export function parseMapPiece(
	mapString: string
): MapPieceData | null {
	// const initial: MapPiece = [[]];

	const mapPiece: MapPieceData = [[], [], [], [], []];

	try {
		// Remove spaces and check for valid length
		const processed = mapString.replace(/\s/g, "");
		if (processed.length !== MAP_PIECE_SIZE) {
			throw new Error(
				`Invalid map string length. Expected ${MAP_PIECE_SIZE}, got ${processed.length}.`
			);
		}

		Array.from(processed).forEach((char, i) => {
			const index = Math.trunc(i / MAP_PIECE_WIDTH);

			// Handle invalid character
			if (!(char in CONVERSION_MAP)) {
				throw new Error(
					`Invalid char found: ${char}. Unable to construct map piece from string ${mapString}.`
				);
			}

			mapPiece[index].push(CONVERSION_MAP[char]);
		});

		return mapPiece;
	} catch (error) {
		console.debug(error);
	}

	return null;
}
