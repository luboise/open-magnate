import { GameStateViewPerPlayer } from "magnate-core/views";
import { atom, useRecoilState } from "recoil";

const RECOIL_GAMESTATE_KEY = "GameState";
type GameStateAtomType = GameStateViewPerPlayer | null;
export const GameStateAtom = atom<GameStateAtomType>({
	key: RECOIL_GAMESTATE_KEY, // unique ID (with respect to other atoms/selectors)
	default: null
});

function useFullGameState() {
	const [state, setState] = useRecoilState(GameStateAtom);
	return { gamestate: state, setGamestate: setState };
}

export default useFullGameState;
