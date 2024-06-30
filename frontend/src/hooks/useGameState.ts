import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";
import {
	RoadAdjacencyType,
	TileType,
	cloneArray
} from "../../../backend/src/utils";
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

const RECOIL_MAP_KEY = "PARSED_MAP";

type MapSelectorType = MapTileData[][] | null;
const mapSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_KEY,
	get: ({ get }) => {
		console.log("map: ", get(GameStateAtom)?.map);
		const baseMap =
			get(GameStateAtom)
				?.map.split(";")
				.map((line, y) =>
					line
						.split("")
						.map((char, x) =>
							parseMapChar(char, x, y)
						)
				) ?? null;
		if (!baseMap) return null;

		const modifiedMap = addMapDetails(baseMap);

		return modifiedMap;
	}
});

export function useGameState(): {
	state: GameStateAtomType;
	map: MapSelectorType;
	setState: (newState: GameStateAtomType) => void;
} {
	const [state, _setState] =
		useRecoilState(GameStateAtom);
	const map = useRecoilValue(mapSelector);

	return { state, map, setState: _setState };
}
function addMapDetails(baseMap: Map2D): Map2D {
	const newMap = cloneArray(baseMap);

	const maxX = baseMap.length - 1;

	for (let x = 0; x <= maxX; x++) {
		const maxY = baseMap[x].length - 1;

		for (let y = 0; y < maxY; y++) {
			const val = newMap[x][y];
			if (val.type === TileType.ROAD) {
				val.data = {
					north:
						y < maxY &&
						newMap[x][y + 1].type ===
							TileType.ROAD,
					south: false,
					east: false,
					west: false
				} as RoadAdjacencyType;
			}
		}
	}

	return newMap;
}
