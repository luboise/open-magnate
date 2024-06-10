import { MapPieceData, parseMapPiece } from "./MapData";

type TileList = Record<number, MapPieceData>;
const GAME_TILES: TileList = [
	parseMapPiece("XXRXX XXRXX RRRRR HHRXX HHRXX"),
	parseMapPiece("XXRXX XLRXX RRRRR XXRXX XXRXX"),
	parseMapPiece("XXRRR XHHXR RHHXR RXXXX RRRXX"),
	parseMapPiece("XXRXX LXRXX RRRRR XXRXX XXRBX"),
	parseMapPiece("XXRXX XBRXX RRRRR XXXXX XXXXX")
]
	.filter((piece) => piece !== null)
	.reduce<TileList>((acc, cur, index) => {
		return { ...acc, [index + 1]: cur as MapPieceData };
	}, {});

export default { GAME_TILES: GAME_TILES };
