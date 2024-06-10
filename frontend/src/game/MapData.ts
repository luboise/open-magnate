enum MapTileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD"
}

export type MapTileData = {
	type: MapTileType;
	data?: any;
};

export type MapPiece = Array<Array<MapTileData>>;

const MAP_PIECE_WIDTH = 5;
const MAP_PIECE_HEIGHT = 5;
const MAP_PIECE_SIZE = MAP_PIECE_WIDTH * MAP_PIECE_HEIGHT;

const PREMADE_MAP_TILES: Record<string, MapTileData> = {
	EMPTY: { type: MapTileType.EMPTY },
	ROAD: { type: MapTileType.ROAD }
};

export function parseMapPiece(
	mapString: string
): MapPiece | null {
	// const initial: MapPiece = [[]];

	const mapPiece: MapPiece = [[], [], [], [], []];

	try {
		if (mapString.length !== MAP_PIECE_SIZE) {
			throw new Error(
				`Invalid map string length. Expected ${MAP_PIECE_SIZE}, got ${mapString.length}.`
			);
		}

		Array.from(mapString).forEach((char, i) => {
			const index = Math.trunc(i / MAP_PIECE_WIDTH);

			if (char === "X") {
				mapPiece[index].push(
					PREMADE_MAP_TILES.EMPTY
				);
				return;
			} else if (char === "R") {
				mapPiece[index].push(
					PREMADE_MAP_TILES.ROAD
				);
				return;
			}

			throw new Error(
				`Invalid char found: ${char}. Unable to construct map piece from string ${mapString}.`
			);
		});

		return mapPiece;
	} catch (error) {
		console.debug(error);
	}

	return null;
}
