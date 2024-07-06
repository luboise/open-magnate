import "./Game.css";

import { useEffect, useReducer } from "react";
import Resizable from "../../../components/Resizable";
import { useGameState } from "../../../hooks/useGameState";
import useLocalVal from "../../../hooks/useLocalVal";
import useMap from "../../../hooks/useMap";
import usePanning from "../../../hooks/usePanning";
import MagnateMap from "../MagnateMap";
import EmployeeTree from "./Conditionals/EmployeeTree/EmployeeTree";
import RestaurantPlacer from "./Conditionals/RestaurantPlacer";
import TurnPlanner from "./Conditionals/TurnPlanner";
import TurnOrderList from "./TurnOrderList";
import TurnProgressIndicator from "./TurnProgressIndicator";
import WindowToolbar, {
	ToolbarType
} from "./WindowToolbar";

interface GameInterfaceState {
	showMap: boolean;
	showEmployeeTree: boolean;
	showPlanner: boolean;
	showLeaderBoard: boolean;
	showMiletones: boolean;
	showTurnOrder: boolean;
}

type GameInterfaceAction = {
	type: "TOGGLE";
	toToggle: ToolbarType;
};

function Game() {
	const { turnProgress, isMyTurn } = useGameState();
	const { onMapObjectClicked } = useMap();

	const { mapRowOrder: map } = useGameState();

	const [toolbarStatus, setToolbarStatus] =
		useLocalVal<GameInterfaceState>("TOOLBAR_STATUS");

	const [state, dispatch] = useReducer(
		(
			state: GameInterfaceState,
			dispatch: GameInterfaceAction
		): GameInterfaceState => {
			if (dispatch.type === "TOGGLE") {
				let key: keyof GameInterfaceState;
				switch (dispatch.toToggle) {
					case "MAP":
						key = "showMap";
						break;
					case "EMPLOYEE TREE":
						key = "showEmployeeTree";
						break;
					case "PLANNER":
						key = "showPlanner";
						break;

					case "LEADERBOARD":
						key = "showLeaderBoard";
						break;

					case "MILETONES":
						key = "showMiletones";
						break;

					case "TURN ORDER":
						key = "showTurnOrder";
						break;

					default:
						return state;
				}
				return {
					...state,
					[key]: !state[key]
				};
			}

			// Fallback case
			return state;
		},
		toolbarStatus || {
			showMap: true,
			showTurnOrder: true,
			showEmployeeTree: false,
			showPlanner: false,
			showLeaderBoard: false,
			showMiletones: false
		}
	);

	const { rightMouseOffset } = usePanning();

	// const regularConditional: JSX.Element = (() => {
	// 	if (!isMyTurn) return <></>;
	// 	else if (turnProgress === "RESTRUCTURING") {
	// 		return
	// 	} else if (turnProgress === "USE_EMPLOYEES") {
	// 	}

	// 	return <></>;
	// })();

	const mapConditional: JSX.Element = (() => {
		if (!isMyTurn) return <></>;

		if (turnProgress === "RESTAURANT_PLACEMENT") {
			return <RestaurantPlacer />;
		}

		return <></>;
	})();

	onMapObjectClicked((event) => {
		if (
			isMyTurn &&
			turnProgress === "RESTAURANT_PLACEMENT"
		)
			console.log("clicked", event);
	});

	// const logicDiv: JSX.Element = (()=>{
	// 	switch ()
	// })();

	useEffect(() => {
		setToolbarStatus(state);
	}, [
		state.showMap,
		state.showEmployeeTree,
		state.showPlanner,
		state.showLeaderBoard,
		state.showMiletones
	]);

	return (
		<div
			id="magnate-play-area"
			className="map-preview-container"
			style={{
				gridTemplateColumns: map
					? `repeat(${map[0].length}, 1fr)`
					: undefined,
				aspectRatio: map
					? `${map[0].length} / ${map.length}`
					: undefined
			}}
		>
			<WindowToolbar
				onClick={(clicked) =>
					dispatch({
						type: "TOGGLE",
						toToggle: clicked
					})
				}
			/>

			<Resizable
				defaultWidth={600}
				minimiseIf={state.showEmployeeTree}
			>
				<EmployeeTree />
			</Resizable>

			<Resizable
				defaultWidth={300}
				localKey="turn-order-list"
				minimiseIf={state.showTurnOrder}
			>
				<TurnOrderList />
				<TurnProgressIndicator />
			</Resizable>

			<Resizable
				defaultWidth={500}
				minimiseIf={state.showPlanner}
			>
				<TurnPlanner />
			</Resizable>

			{/* <Resizable
				defaultWidth={1000}
				localKey="magnate-map-section"
				id="magnate-map-section"
				minimiseIf={!toolbarStatus?.showMap}
			> */}
			<MagnateMap
				type="full"
				style={{
					left: rightMouseOffset.x,
					top: rightMouseOffset.y,
					zIndex: -1
				}}
			>
				{mapConditional}
			</MagnateMap>
			{/* </Resizable> */}
		</div>
	);
}

export default Game;

