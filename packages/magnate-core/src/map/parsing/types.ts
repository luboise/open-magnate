import { MapAnyTileType } from "../tiles/types";

export const MAP_PIECE_ROW_SEP = " ";
export const MAP_PIECE_COL_SEP = ";";

export type ParsableMapChar =
	| MapStringChar
	| typeof MAP_PIECE_ROW_SEP
	| typeof MAP_PIECE_COL_SEP;

export type MapStringChar =
	| "X"
	| "R"
	| "L"
	| "C"
	| "B"
	| "H"
	| "X"
	| "M";

export type ParsableMapString = string;
export const CHAR_TO_MAP_TILETYPE: Record<
	MapStringChar,
	{ tileType: MapAnyTileType }
> = {
	X: { tileType: "EMPTY" },

	R: { tileType: "ROAD" },
	H: { tileType: "HOUSE" },

	L: { tileType: "LEMONADE" },
	C: { tileType: "COLA" },
	B: { tileType: "BEER" },
	M: { tileType: "MARKETING" }
} as const;
