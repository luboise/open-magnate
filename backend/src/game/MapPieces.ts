export type MapStringChar =
	| "X"
	| "R"
	| "L"
	| "C"
	| "B"
	| "H"
	| "X";

type MapPieceColArray = [
	MapStringChar,
	MapStringChar,
	MapStringChar,
	MapStringChar,
	MapStringChar
];

const MAP_PIECE_ROW_SEP = " ";
const MAP_PIECE_COL_SEP = ";";

export type MapTileArray = [
	MapPieceColArray,
	MapPieceColArray,
	MapPieceColArray,
	MapPieceColArray,
	MapPieceColArray
];

const MAP_PIECE_STRINGS: string[] = [
	"XXRXX XXRXX RRRRR HHRXX HHRXX",
	"XXRXX XLRXX RRRRR XXRXX XXRXX",
	"XXRRR XHHXR RHHXR RXXXX RRRXX",
	"XXRXX LXRXX RRRRR XXRXX XXRBX",
	"XXRXX XBRXX RRRRR XXXXX XXXXX",

	"HHRXX HHRXX RRRRR XXRXX XXRXX",
	"HHRXX HHRXX RRRRR XXXXX XXXXX",
	"RRRRR RXHHR RXHHR XXXXX XXXXX",
	"XXRXX XXRXX RRRRR XHHXX XHHXX",
	"RRRXX RBXXX RXHHR XXHHR XXRRR",

	"XXRXX XCRXX RRRRR XXRXX XXRXX",
	"XBRXX XXRXX RRRRR XXRXX XXRXX",
	"RRRRR RHHXR RHHXR XXXXX XXXXX",
	"XXRCX XXRXX RRRRR BXRXX XXRXX",
	"XXRXX XXRXX RRRRR XXXHH XXXHH",

	"XXRHH XXRHH RRRRR XXRXX XXRXX",
	"XXRXX XXRXX RRRRR XXXLX XXXXX",
	"XXRRR XXXLR RXXXR RCXXX RRRXX",
	"XXRXX XXRXX RRRRR XCXXX XXXXX",
	"RRRRR RXHHR RXHHR RXXXR RRRRR"
];

export const MAP_PIECES: Record<number, MapTileArray> =
	Object.fromEntries(
		MAP_PIECE_STRINGS.map((pieceString, index) => [
			index + 1,
			parseMapString(pieceString)
		])
	);

export function parseMapString(
	mapString: string
): MapTileArray {
	const array = mapString
		.split(MAP_PIECE_ROW_SEP)
		.map((row) => Array.from(row) as MapPieceColArray);

	return array as MapTileArray;
}

export function createMapPieceString(data: MapTileArray) {
	let outValue = "";

	for (let row = 0; row < data.length; row++) {
		for (let col = 0; col < data[row].length; col++) {
			outValue += data[row][col];
		}

		outValue +=
			row !== data.length - 1
				? MAP_PIECE_ROW_SEP
				: "";
	}

	return outValue;
}

export function createMapString(
	data: MapStringChar[][]
): string {
	// console.log(data);
	let outValue = "";

	const maxY = data[0].length;
	const maxX = data.length;

	for (let y = 0; y < maxY; y++) {
		for (let x = 0; x < maxX; x++) {
			outValue += data[x][y];
		}

		outValue += y !== maxY - 1 ? MAP_PIECE_COL_SEP : "";
	}

	return outValue;
}
