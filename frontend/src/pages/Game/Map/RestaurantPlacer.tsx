import { useCallback, useEffect } from "react";
import { MOVE_TYPE } from "../../../../../shared/Moves";
import useClientState, {
	OnTilePlacedCallback
} from "../../../hooks/game/useClientState";
import { useGameStateView } from "../../../hooks/game/useGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import { RestaurantTile } from "../../../utils";

// interface RestaurantPlacerState {
// 	x: number;
// 	y: number;
// 	entrance: ENTRANCE_CORNER;
// }

// type RestaurantPlacerAction =
// 	| {
// 			action: "NEW_POSITION";
// 			x: number;
// 			y: number;
// 	  }
// 	| {
// 			action: "SET_ENTRANCE";
// 			entrance: ENTRANCE_CORNER;
// 	  }
// 	| {
// 			action: "PLACE_RESTAURANT";
// 	  };

function RestaurantPlacer() {
	const { makeMove } = usePageGame();

	const { playerData } = useGameStateView();

	const onTileDropped = useCallback<OnTilePlacedCallback>(
		async (tile) => {
			if (tile.tileType === "RESTAURANT") {
				submitRestaurant(tile);
			}
		},
		[]
	);

	const { rotatePlacement, startPlacing } =
		useClientState(onTileDropped);

	// const [state, dispatch] = useReducer(
	// 	(
	// 		state: RestaurantPlacerState,
	// 		action: RestaurantPlacerAction
	// 	): RestaurantPlacerState => {
	// 		switch (action.action) {
	// 			case "NEW_POSITION":
	// 				return {
	// 					...state,
	// 					x: action.x,
	// 					y: action.y
	// 				};
	// 			case "SET_ENTRANCE":
	// 				console.debug(
	// 					"Setting entrance to " +
	// 						action.entrance
	// 				);
	// 				return {
	// 					...state,
	// 					entrance: action.entrance
	// 				};

	// 			case "PLACE_RESTAURANT":
	// 				makeMove({
	// 					MoveType:
	// 						MOVE_TYPE.PLACE_RESTAURANT,

	// 						x: state.x,
	// 						y: state.y,
	// 						entrance: state.entrance
	// 					});
	// 					return state;
	// 				default:
	// 					return state;
	// 			}
	// 		},
	// 		{
	// 			x: 0,
	// 			y: 0,
	// 			entrance: "TOPLEFT"
	// 		}
	// 	);

	// TODO: Implement actual house placement logic
	const isValidPlacement = false;
	// if (event.type === "TILE" && event.data.type === "EMPTY")

	function submitRestaurant(tile: RestaurantTile) {
		makeMove({
			MoveType: MOVE_TYPE.PLACE_RESTAURANT,
			x: tile.pos.x,
			y: tile.pos.y,
			// TODO: Fix this to support all corner directions
			entrance: "TOPLEFT"
		});
	}

	useEffect(() => {
		startPlacing({
			tileType: "RESTAURANT",
			width: 2,
			height: 2,
			rotation: 0,
			pos: { x: 0, y: 0 },
			restaurant: playerData.restaurant
		});
	}, []);

	return <></>;
}

export default RestaurantPlacer;

