import { GameStateView } from "magnate-core/networking";
import { atom, useRecoilState } from "recoil";

const RECOIL_GAMESTATE_KEY = "GameState";

type GameStateAtomType = GameStateView | null;

export const GameStateAtom = atom<GameStateAtomType>({
	key: RECOIL_GAMESTATE_KEY, // unique ID (with respect to other atoms/selectors)
	default: null
});

function useGameStateView() {
	const [state, setState] = useRecoilState(GameStateAtom);
	return { gameState: state, setGameState: setState };
}

export default useGameStateView;
