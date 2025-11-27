import { MapTile } from "magnate-core";
import { atom, useRecoilState } from "recoil";

type MapInteractionState = {
	hovering: MapTile | null;
};

const MapTileAtom = atom<MapInteractionState>({
	key: "MAP_TILE_INTERACTION_OBJECT",
	default: {
		hovering: null
	}
});

function useMapTileInteraction() {
	const [state, setState] = useRecoilState(MapTileAtom);

	function nowHovering(tile: MapTile | null) {
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
