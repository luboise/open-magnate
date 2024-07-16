import "./Game.css";

import { useEffect, useMemo, useReducer } from "react";
import Resizable from "../../../components/Resizable";
import { useGameState } from "../../../hooks/useGameState";
import useLocalVal from "../../../hooks/useLocalVal";
import useMap from "../../../hooks/useMap";
import usePanning from "../../../hooks/usePanning";
import useScalingValue from "../../../hooks/useScalingValue";
import EmployeeTree from "./Conditionals/EmployeeTree/EmployeeTree";
import RestaurantPlacer from "./Conditionals/RestaurantPlacer";
import TurnPlanner from "./Conditionals/TurnPlanner";
import GlobalReserveDisplay from "./GlobalReserveDisplay";
import MagnateMap from "./Map/MagnateMap";
import TurnHandler from "./TurnHandler";
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
	showMilestones: boolean;
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
		scaleUp: mapZoomIn,
		scaleDown: mapZoomOut
	} = useScalingValue(0.3, 4, 1.25);

	const [toolbarStatus, setToolbarStatus] =
		useLocalVal<GameInterfaceState>("TOOLBAR_STATUS");

	const { offset, startPanning } = usePanning(
		"outer-offset",
		"RIGHT"
	);

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
					case "TURN PLANNER":
						key = "showPlanner";
						break;

					case "LEADERBOARD":
						key = "showLeaderBoard";
						break;

					case "MILESTONES":
						key = "showMilestones";
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
			showMilestones: false
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

	const styleProperties = useMemo(
		() => ({
			translate: `${offset.x}px ${offset.y}px`,
			scale: String(zoom)
		}),
		[offset, zoom]
	);

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
		state.showMilestones
	]);

	// TODO: Fix invisible elements to not each click inputs and keyboard inputs
	return (
		<div
			id="magnate-play-area"
			onContextMenuCapture={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			style={{
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
			onMouseDown={startPanning}
			// When the user scrolls up, call onScaleUp
			onWheel={(e) => {
				if (e.deltaY < 0) mapZoomIn();
				else mapZoomOut();
			}}
		>
			{state.showMap ? (
				<MagnateMap
					id="magnate-map"
					style={{
						zIndex: -1,
						...styleProperties
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

			<Resizable
				defaultWidth={1200}
				minimiseIf={state.showEmployeeTree}
			>
				<EmployeeTree id="employee-tree" />
			</Resizable>

			<Resizable
				defaultWidth={300}
				minimiseIf={state.showTurnOrder}
			>
				<div id="turn-order-list">
					<TurnOrderList />
					<TurnProgressIndicator />
				</div>
			</Resizable>

			<Resizable
				defaultWidth={500}
				minimiseIf={state.showPlanner}
			>
				<TurnPlanner id="turn-planner" />
			</Resizable>

			<TurnHandler />
			<WindowToolbar
				onClick={(clicked) =>
					dispatch({
						type: "TOGGLE",
						toToggle: clicked
					})
				}
			/>

			<GlobalReserveDisplay />
		</div>
	);
}

export default Game;

