import { atom } from "recoil";
import { Player } from "../game/Player";

const PlayersAtom = atom<Array<Player>>({
	key: "Players", // unique ID (with respect to other atoms/selectors)
	default: [] // default value (aka initial value)
});

function useGlobalState(): {
	players: typeof PlayersAtom;
} {
	return { players: PlayersAtom };
}

export default useGlobalState;
