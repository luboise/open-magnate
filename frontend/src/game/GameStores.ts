import { MapPiece, parseMapPiece } from "./MapData";

type TileList = Record<number, MapPiece>;
const GAME_TILES: TileList = [
	parseMapPiece("XXXXXXXXXX"),
	parseMapPiece("XXXXXXXXRR"),
	parseMapPiece("XXXXXXXRRR"),
	parseMapPiece("XXRXXXXX")
]
	.filter((piece) => piece !== null)
	.reduce<TileList>((acc, cur, index) => {
		return { ...acc, [index]: cur as MapPiece };
	}, {});

export default { GAME_TILES: GAME_TILES };
