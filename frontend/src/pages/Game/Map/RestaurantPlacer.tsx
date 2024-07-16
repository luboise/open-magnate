import { useReducer } from "react";
import { ENTRANCE_CORNER } from "../../../../../backend/src/dataViews";
import { MOVE_TYPE } from "../../../../../shared/Moves";
import { Clamp } from "../../../../../shared/utils";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useGameState } from "../../../hooks/useGameState";
import useMap, {
	useBoardInfo
} from "../../../hooks/useMap";
import usePageGame from "../../../hooks/usePageGame";
import { rotateEntranceCorner } from "../../../utils";

interface RestaurantPlacerState {
	x: number;
	y: number;
	entrance: ENTRANCE_CORNER;
}

type RestaurantPlacerAction =
	| {
			action: "NEW_POSITION";
			x: number;
			y: number;
	  }
	| {
			action: "SET_ENTRANCE";
			entrance: ENTRANCE_CORNER;
	  }
	| {
			action: "PLACE_RESTAURANT";
	  };

function RestaurantPlacer() {
	const { makeMove } = usePageGame();
	const boardInfo = useBoardInfo();
	const { state: gameState } = useGameState();

	const [state, dispatch] = useReducer(
		(
			state: RestaurantPlacerState,
			action: RestaurantPlacerAction
		): RestaurantPlacerState => {
			switch (action.action) {
				case "NEW_POSITION":
					return {
						...state,
						x: action.x,
						y: action.y
					};
				case "SET_ENTRANCE":
					console.debug(
						"Setting entrance to " +
							action.entrance
					);
					return {
						...state,
						entrance: action.entrance
					};

				case "PLACE_RESTAURANT":
					makeMove({
						MoveType:
							MOVE_TYPE.PLACE_RESTAURANT,

						x: state.x,
						y: state.y,
						entrance: state.entrance
					});
					return state;
				default:
					return state;
			}
		},
		{
			x: 0,
			y: 0,
			entrance: "TOPLEFT"
		}
	);

	const { onMapObjectClicked, onMapObjectHovered } =
		useMap();

	onMapObjectClicked((event) => {
		console.log("clicked", event);
	});

	onMapObjectHovered((event) => {
		dispatch({
			action: "NEW_POSITION",
			x: Clamp(
				event.data.x,
				0,
				boardInfo.width - 2,
				true
			),
			y: Clamp(
				event.data.y,
				0,
				boardInfo.height - 2,
				true
			)
		});
	});

	const onScroll = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		dispatch({
			action: "SET_ENTRANCE",
			entrance: rotateEntranceCorner(
				state.entrance,
				event.deltaY > 0
			)
		});
	};

	// TODO: Implement actual house placement logic
	const isValidPlacement = false;
	// if (event.type === "TILE" && event.data.type === "EMPTY")

	function submitRestaurant() {
		makeMove({
			MoveType: MOVE_TYPE.PLACE_RESTAURANT,
			x: state.x,
			y: state.y,
			entrance: state.entrance
		});
	}

	return (
		<RestaurantImage
			restaurantNumber={
				gameState?.privateData.restaurant ?? 1
			}
			style={{
				gridColumn: `${state.x + 1} / span 2`,
				gridRow: `${state.y + 1} / span 2`,
				opacity: isValidPlacement ? 1 : 0.5,
				// Red if invalid placement
				backgroundColor: "red",
				backgroundBlendMode: "multiply",

				// filter: isValidPlacement
				// 	? "none"
				// 	: "saturate(0%)",
				// gridRowStart: state.y,
				// gridColumnEnd: state.x + 2,
				// gridRowEnd: state.y + 2,
				width: "100%",
				height: "100%",
				// Span 2 rows and 2 columns

				mixBlendMode: "multiply",

				border: "1px solid black",
				zIndex: 2
			}}
			// onWheel={onScroll}
			onScroll={onScroll}
			onWheel={onScroll}
			onClick={submitRestaurant}
		/>
	);
}

export default RestaurantPlacer;

