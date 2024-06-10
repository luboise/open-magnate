import { MapPieceData, parseMapPiece } from "./MapData";

type TileList = Record<number, MapPieceData>;
const GAME_TILES: TileList = [
	parseMapPiece("XXRXX XXRXX RRRRR HHRXX HHRXX"),
	parseMapPiece("XXRXX XLRXX RRRRR XXRXX XXRXX"),
	parseMapPiece("XXRRR XHHXR RHHXR RXXXX RRRXX"),
	parseMapPiece("XXRXX LXRXX RRRRR XXRXX XXRBX"),
	parseMapPiece("XXRXX XBRXX RRRRR XXXXX XXXXX"),

	parseMapPiece("HHRXX HHRXX RRRRR XXRXX XXRXX"),
	parseMapPiece("HHRXX HHRXX RRRRR XXXXX XXXXX"),
	parseMapPiece("RRRRR RXHHR RXHHR XXXXX XXXXX"),
	parseMapPiece("XXRXX XXRXX RRRRR XHHXX XHHXX"),
	parseMapPiece("RRRXX RBXXX RXHHR XXHHR XXRRR"),

	parseMapPiece("XXRXX XCRXX RRRRR XXRXX XXRXX"),
	parseMapPiece("XBRXX XXRXX RRRRR XXRXX XXRXX"),
	parseMapPiece("RRRRR RHHXR RHHXR XXXXX XXXXX"),
	parseMapPiece("XXRCX XXRXX RRRRR BXRXX XXRXX"),
	parseMapPiece("XXRXX XXRXX RRRRR XXXHH XXXHH"),

	parseMapPiece("XXRHH XXRHH RRRRR XXRXX XXRXX"),
	parseMapPiece("XXRXX XXRXX RRRRR XXXLX XXXXX"),
	parseMapPiece("XXRRR XXXLR RXXXR RCXXX RRRXX"),
	parseMapPiece("XXRXX XXRXX RRRRR XCXXX XXXXX"),
	parseMapPiece("RRRRR RXHHR RXHHR RXXXR RRRRR"),
]
	.filter((piece) => piece !== null)
	.reduce<TileList>((acc, cur, index) => {
		return { ...acc, [index + 1]: cur as MapPieceData };
	}, {});

export default { GAME_TILES: GAME_TILES };
