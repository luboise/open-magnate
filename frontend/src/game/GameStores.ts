import { MapPieceData, parseMapPiece } from "./MapData";

type TileList = Record<number, MapPieceData>;
const GAME_TILES: TileList = [
	parseMapPiece("XXXXXXXXXXXXXXXXXXXXXXXXX"),
	parseMapPiece("XXXXXXXXXXXXXXXXXXXXXXXXX"),
	parseMapPiece("XXXXXXXXXXXXXXXXXXXXXXXXX"),
	parseMapPiece("XXXXXXXXXXXXXXXXXXXXXXXXX")
]
	.filter((piece) => piece !== null)
	.reduce<TileList>((acc, cur, index) => {
		return { ...acc, [index]: cur as MapPieceData };
	}, {});

export default { GAME_TILES: GAME_TILES };
