/*
import { GetTransposed } from "../../area/AreaUtils";
import {
	GardenView,
	HouseView,
	RestaurantView
} from "../../views/MapViews";
import { MarketingCampaignView } from "../../views/MarketingViews";

import { MarketingTilesByNumber } from "@/game";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_SIZE,
	MAP_PIECE_WIDTH
} from "../../game/constants/MapConstants";
import { new2DArray } from "../../utils";
import {
	AbstractMapTileInterface,
	MapAnyTileType,
	MapBackgroundTile,
	MapPieceData
} from "../Tile_Old";
import {
	Map2D,
	PartialMap2D,
	UndetailedMap2D
} from "../map_2d";
import { addMapDetails } from "../map_2d/MapDetails";
import {
	CHAR_TO_MAP_TILETYPE,
	MapStringChar,
	ParsableMapString
} from "./types";

export function IsValidMapStringChar(
	char: string
): char is MapStringChar {
	return (
		char.length === 1 && char in CHAR_TO_MAP_TILETYPE
	);
}

export function IsParsableMapString(
	str: string
): str is ParsableMapString {
	return Array.from(str).every((char) =>
		IsValidMapStringChar(char)
	);
}

export function translateMapTile(
	tile: MapBackgroundTile,
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
): AbstractMapTileInterface {
	// TODO: Separate this logic out for background/overlay
	const thetype: { tileType: MapAnyTileType } =
		CHAR_TO_MAP_TILETYPE[char];

	const parsedObject: AbstractMapTileInterface = {
		level: "BACKGROUND",
		tileType: thetype.tileType,
		pos: {
			x: x,
			y: y
		}
	};

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
		return rawMap.split(";").map((line) =>
			line.split("").map((char) => {
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
	_gardens: GardenView[]
): string {
	const array = mapTo2DArray(rawMap);
	if (!array)
		throw new Error(
			"Unable to parse 2D array from raw map"
		);

	const map = GetTransposed(array);
	if (!map) throw new Error("Unable to parse raw map");

	for (const house of houses) {
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++)
				map[house.pos.x + i][house.pos.y + j] = "H";
	}

	for (const restaurant of restaurants) {
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++)
				map[restaurant.pos.x + i][
					restaurant.pos.y + j
				] = "R";
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
			marketingCampaign.pos.orientation ===
			"HORIZONTAL"
				? tile.width
				: tile.height;
		const height =
			marketingCampaign.pos.orientation ===
			"HORIZONTAL"
				? tile.height
				: tile.width;

		for (let i = 0; i < width; i++)
			for (let j = 0; j < height; j++)
				map[marketingCampaign.pos.x + i][
					marketingCampaign.pos.y + j
				] = "M";
	}

	const finalMap = GetTransposed(map);
	return finalMap.map((col) => col.join("")).join(";");
}

export function ParseMapStringFromGSV(
	mapString: string
): Map2D {
	const rowOrderMap = parseRawMap(mapString) ?? null;

	if (rowOrderMap === null)
		throw new Error(
			"Unable to create rowOrderMap from mapString"
		);

	return addMapDetails(GetTransposed(rowOrderMap));
}
*/
const UNIMPLEMENTED = true;
export default UNIMPLEMENTED;
