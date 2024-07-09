import "./Game.css";

import { useEffect, useReducer } from "react";
import Resizable from "../../../components/Resizable";
import { useGameState } from "../../../hooks/useGameState";
import useLocalVal from "../../../hooks/useLocalVal";
import useMap from "../../../hooks/useMap";
import usePanning from "../../../hooks/usePanning";
import useScalingValue from "../../../hooks/useScalingValue";
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
	const {
		turnProgress,
		isMyTurn,
		mapRowOrder: map
	} = useGameState();
	const { onMapObjectClicked } = useMap();

	const {
		scaler: zoom,
		onScaleUp,
		onScaleDown
	} = useScalingValue();

	const [toolbarStatus, setToolbarStatus] =
		useLocalVal<GameInterfaceState>("TOOLBAR_STATUS");

	const { rightMouseOffset, startRightPan } =
		usePanning();

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

	// TODO: Fix invisible elements to not each click inputs and keyboard inputs
	return (
		<div
			id="magnate-play-area"
			onContextMenu={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			onMouseDown={startRightPan}
			style={{
				gridTemplateColumns: map
					? `repeat(${map[0].length}, 1fr)`
					: undefined,
				aspectRatio: map
					? `${map[0].length} / ${map.length}`
					: undefined,
				position: "fixed",

				width: "100vw",
				height: "100vh",
				margin: 0,
				padding: 0,
				top: 0,
				left: 0,
				border: 0,
				backgroundColor: "grey"
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
				defaultWidth={1200}
				minimiseIf={state.showEmployeeTree}
			>
				<EmployeeTree id="rz-employee-tree" />
			</Resizable>

			<Resizable
				defaultWidth={300}
				minimiseIf={state.showTurnOrder}
			>
				<div id="rz-turn-order-list">
					<TurnOrderList />
					<TurnProgressIndicator />
				</div>
			</Resizable>

			<Resizable
				defaultWidth={500}
				minimiseIf={state.showPlanner}
			>
				<TurnPlanner id="rz-turn-planner" />
			</Resizable>

			{/* <Resizable
				defaultWidth={1000}
				localKey="magnate-map-section"
				id="magnate-map-section"
				minimiseIf={!toolbarStatus?.showMap}
				> */}
			{state.showMap ? (
				<MagnateMap
					id="rz-magnate-map"
					type="full"
					style={{
						zIndex: -1,
						translate: `${rightMouseOffset.x}px ${rightMouseOffset.y}px`,
						scale: zoom
					}}
					onContextMenu={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{mapConditional}
				</MagnateMap>
			) : (
				<></>
			)}
			{/* </Resizable> */}
		</div>
	);
}

export default Game;
