import {
	GardenView,
	HouseView,
	MarketingCampaignView,
	RestaurantView
} from "../backend/src/dataViews";
import { new2DArray } from "../backend/src/utils";

import {
	PartialMap2D,
	PartialMapTileData,
	UndetailedMap2D
} from "./MapData";
import { MarketingTilesByNumber } from "./MapTiles";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_SIZE,
	MAP_PIECE_WIDTH,
	MapPieceData,
	MapTileData
} from "./MapTiles/MapPieceTiles";
import { TileType } from "./MapTiles/Tile";

export type MapStringChar =
	| "X"
	| "R"
	| "L"
	| "C"
	| "B"
	| "H"
	| "X"
	| "M";

export function IsValidMapStringChar(
	char: string
): char is MapStringChar {
	return (
		char.length === 1 &&
		char in CHAR_TO_MAP_TILE_CONVERTER
	);
}

export const MAP_PIECE_ROW_SEP = " ";
export const MAP_PIECE_COL_SEP = ";";

export type ParsableMapChar =
	| MapStringChar
	| typeof MAP_PIECE_ROW_SEP
	| typeof MAP_PIECE_COL_SEP;

export type ParsableMapString = string;

export function IsParsableMapString(
	str: string
): str is ParsableMapString {
	return Array.from(str).every((char) =>
		IsValidMapStringChar(char)
	);
}

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
	char: MapStringChar,
	x: number,
	y: number
): PartialMapTileData {
	// Handle invalid character

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

				if (!IsValidMapStringChar(char))
					throw new Error(
						`Invalid map char: ${char}`
					);

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
	if (!IsParsableMapString(mapString))
		throw new Error("Invalid map string");

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

export function mapTo2DArray(
	rawMap: ParsableMapString
): UndetailedMap2D | null {
	try {
		return rawMap.split(";").map((line, y) =>
			line.split("").map((char, x) => {
				if (!IsValidMapStringChar(char))
					throw new Error(
						"Invalid map character"
					);
				return char;
			})
		);
	} catch (error) {
		console.debug("Unable to parse raw map: ", error);
		return null;
	}
}

// Row order
export function parseRawMap(
	map: string
): PartialMap2D | null {
	try {
		const asArray = mapTo2DArray(map);
		if (!asArray) return null;

		return asArray.map((col, y) =>
			col.map((tile, x) => parseMapChar(tile, x, y))
		);
	} catch (error) {
		console.debug("Unable to parse raw map: ", error);
		return null;
	}
}

export function createDetailedMapString(
	rawMap: string,
	marketingCampaigns: MarketingCampaignView[],
	restaurants: RestaurantView[],
	houses: HouseView[],
	gardens: GardenView[]
): string {
	const map = mapTo2DArray(rawMap);

	if (!map) throw new Error("Unable to parse raw map");

	for (const house of houses) {
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++)
				map[house.x + i][house.y + j] = "H";
	}

	for (const restaurant of restaurants) {
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++)
				map[restaurant.x + i][restaurant.y + j] =
					"R";
	}

	for (const marketingCampaign of marketingCampaigns) {
		const tile =
			MarketingTilesByNumber[
				marketingCampaign.priority
			];
		if (!tile)
			throw new Error(
				`Error creating detailed map string, no tile found with tile number ${marketingCampaign.priority}`
			);

		const width =
			marketingCampaign.orientation === "HORIZONTAL"
				? tile.width
				: tile.height;
		const height =
			marketingCampaign.orientation === "HORIZONTAL"
				? tile.height
				: tile.width;

		for (let i = 0; i < width; i++)
			for (let j = 0; j < height; j++)
				map[marketingCampaign.x + i][
					marketingCampaign.y + j
				] = "M";
	}

	return map.map((col) => col.join("")).join(";");
}

export const CHAR_TO_MAP_TILE_CONVERTER: Record<
	MapStringChar,
	{ tileType: TileType }
> = {
	X: { tileType: TileType.EMPTY },

	R: { tileType: TileType.ROAD },
	H: { tileType: TileType.HOUSE },

	L: { tileType: TileType.LEMONADE },
	C: { tileType: TileType.COLA },
	B: { tileType: TileType.BEER },
	M: { tileType: TileType.MARKETING }
} as const;

