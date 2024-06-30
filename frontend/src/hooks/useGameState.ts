import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";
import {
	GameStateView,
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
	get: ({ get }) =>
		get(GameStateAtom)
			?.map.split(";")
			.map((line, x) =>
				line
					.split("")
					.map((char, y) =>
						parseMapChar(char, x, y)
					)
			) ?? null
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
