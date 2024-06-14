import { atom, selector, useRecoilState } from "recoil";
import { MapTileData } from "../game";

const RECOIL_MAP_KEY = "MapState";
const MapAtom = atom<Array<MapTileData>>({
	key: RECOIL_MAP_KEY, // unique ID (with respect to other atoms/selectors)
	default: []
});

const MapTileCount = selector({
	key: RECOIL_MAP_KEY,
	get: ({ get }) => get(MapAtom).length
});

function useMap(): typeof MapAtom {
	const [map, setMap] = useRecoilState(MapAtom);

	return {};
}
