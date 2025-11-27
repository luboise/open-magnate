import {
	MapBackgroundTile,
	MapOverlayTile
} from "magnate-core";
import { atom, useRecoilState } from "recoil";

type HoveringType = MapOverlayTile | MapBackgroundTile;

type MapInteractionState = {
	hovering: HoveringType | null;
};

const MapTileAtom = atom<MapInteractionState>({
	key: "MAP_TILE_INTERACTION_OBJECT",
	default: {
		hovering: null
	}
});

function useMapTileInteraction() {
	const [state, setState] = useRecoilState(MapTileAtom);

	function nowHovering(tile: HoveringType | null) {
		setState({
			...state,
			hovering: tile
		});
	}

	// useEffect(() => {
	// 	console.debug("Now hovering over ", state.hovering);
	// }, [state, state.hovering]);

	return {
		nowHovering,
		currentlyHovering: Boolean(state.hovering),
		hovering: state.hovering
	};
}

export default useMapTileInteraction;
