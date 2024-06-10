enum MapTileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD"
}

export type MapPiece = Array<Array<MapTileType>>;

export function parseMapPiece(
	mapString: string
): MapPiece | null {
	// const initial: MapPiece = [[]];

	const mapPiece: MapPiece = [[]];

	try {
		Array.from(mapString).forEach((char) => {
			if (char === "X") {
				mapPiece[0].push(MapTileType.EMPTY);
				return;
			} else if (char === "R") {
				mapPiece[0].push(MapTileType.ROAD);
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
