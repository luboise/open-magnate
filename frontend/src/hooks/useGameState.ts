import { atom, selector, useRecoilState } from "recoil";
import { GameState } from "../utils";
import useAPI from "./useAPI";

const RECOIL_GAMESTATE_KEY = "GameState";
const GameStateAtom = atom<GameState | null>({
	key: RECOIL_GAMESTATE_KEY, // unique ID (with respect to other atoms/selectors)
	default: null
});

const mapSelector = selector({
	key: "TEST",
	get: ({ get }) => get(GameStateAtom)?.mapPieces
});

export function useGameState(): {
	newGame: () => void;
	state: GameState | null;
	map: typeof mapSelector;
} {
	const { get } = useAPI();

	const [state, setState] = useRecoilState(GameStateAtom);

	async function newGame() {
		setState(null);
		const x: GameState | null = await get("/game/new");
		if (!x) {
			console.error(
				"Failed to acquire new game from the API."
			);
			return;
		}
		console.debug(x);
		setState(x);
	}

	return { newGame, state: state, map: mapSelector };
}
