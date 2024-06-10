import { atom } from "recoil";
import { MapPiece } from "../game";
import { Player } from "../game/Player";

const players = atom<Array<Player>>({
	key: "playersState", // unique ID (with respect to other atoms/selectors)
	default: [] // default value (aka initial value)
});

const map = atom<Array<MapPiece>>({
	key: "playersState", // unique ID (with respect to other atoms/selectors)
	default: []
});

function useGlobalState(): {
	players: typeof players;
	map: typeof map;
} {
	return { players, map };
}

export default useGlobalState;
