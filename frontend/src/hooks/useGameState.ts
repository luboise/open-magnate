import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";
import {
	CloneArray,
	GetTransposed,
	TileType
} from "../../../backend/src/utils";
import {
	IsConnecting,
	IsMaxBound,
	IsMinBound,
	RoadAdjacencyType
} from "../../../shared/MapData";
import {
	GameStateView,
	Map2D,
	MapTileData,
	parseMapChar
} from "../utils";

const RECOIL_GAMESTATE_KEY = "GameState";
type GameStateAtomType = GameStateView | null;
const GameStateAtom = atom<GameStateAtomType>({
	key: RECOIL_GAMESTATE_KEY, // unique ID (with respect to other atoms/selectors)
	default: null
});

const RECOIL_MAP_COL_ORDER_KEY = "PARSED_MAP_COL_ORDER";
const RECOIL_MAP_ROW_ORDER_KEY = "PARSED_MAP_ROW_ORDER";

type MapSelectorType = MapTileData[][] | null;
const mapColumnOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_COL_ORDER_KEY,
	get: ({ get }) => {
		const mapString = get(GameStateAtom)?.map;

		if (!mapString) return null;

		console.log("map: ", get(GameStateAtom)?.map);

		const rowOrderMap =
			mapString
				.split(";")
				.map((line, y) =>
					line
						.split("")
						.map((char, x) =>
							parseMapChar(char, x, y)
						)
				) ?? null;
		if (!rowOrderMap) return null;

		return addMapDetails(GetTransposed(rowOrderMap));
	}
});

const mapRowOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_ROW_ORDER_KEY,
	get: ({ get }) => {
		const colOrder = get(mapColumnOrderSelector);
		if (!colOrder) return null;

		return GetTransposed(colOrder);
	}
});
export function useGameState(): {
	state: GameStateAtomType;
	mapColOrder: MapSelectorType;
	mapRowOrder: MapSelectorType;
	setState: (newState: GameStateAtomType) => void;
} {
	const [state, _setState] =
		useRecoilState(GameStateAtom);
	const mapColOrder = useRecoilValue(
		mapColumnOrderSelector
	);
	const mapRowOrder = useRecoilValue(mapRowOrderSelector);

	return {
		state,
		mapColOrder,
		mapRowOrder,
		setState: _setState
	};
}

function addMapDetails(baseMap: Map2D): Map2D {
	const newMap = CloneArray(baseMap);

	const maxX = baseMap.length - 1;

	// function test(y, maxy, )

	// Since the data is in column major order, iterate Y first
	for (let x = 0; x <= maxX; x++) {
		const maxY = newMap[x].length - 1;

		for (let y = 0; y <= maxY; y++) {
			const val = newMap[x][y];

			val.connecting = IsConnecting(val.x, val.y);

			if (val.type === TileType.ROAD) {
				val.data = {
					north:
						(!IsMinBound(y) &&
							y > 0 &&
							newMap[x][y - 1].type ===
								TileType.ROAD) ||
						IsConnecting(x, y - 1),
					south:
						(!IsMaxBound(y) &&
							y < maxY &&
							newMap[x][y + 1].type ===
								TileType.ROAD) ||
						IsConnecting(x, y + 1),
					east:
						(!IsMaxBound(x) &&
							x < maxX &&
							newMap[x + 1][y].type ===
								TileType.ROAD) ||
						IsConnecting(val.x + 1, val.y),
					west:
						(!IsMinBound(x) &&
							x > 0 &&
							newMap[x - 1][y].type ===
								TileType.ROAD) ||
						IsConnecting(val.x - 1, val.y)
				} as RoadAdjacencyType;
			}
		}
	}

	return newMap;
}
