import "./PageGame.css";

import { useEffect, useMemo, useReducer } from "react";

import Resizable from "../../global_components/Resizable";
import { useGameState } from "../../hooks/game/useGameState";
import useMap from "../../hooks/game/useMap";
import useLocalVal from "../../hooks/useLocalVal";
import usePanning from "../../hooks/usePanning";
import useScalingValue from "../../hooks/useScalingValue";
import EmployeeTree from "./EmployeeTree/EmployeeTree";
import TurnHandler from "./GlobalUI/TurnHandler";
import TurnOrderList from "./GlobalUI/TurnOrderList";
import WindowToolbar, {
	ToolbarType
} from "./GlobalUI/WindowToolbar";
import MagnateMap from "./Map/MagnateMap";
import RestaurantPlacer from "./Map/RestaurantPlacer";
import GlobalReserveDisplay from "./Reserve/GlobalReserveDisplay";
import SalaryHandler from "./SalaryHandler/SalaryHandler";
import TurnPlanner from "./TurnPlanner/TurnPlanner";
import TurnProgressIndicator from "./TurnProgressIndicator/TurnProgressIndicator";

interface GameInterfaceState {
	showMap: boolean;
	showEmployeeTree: boolean;
	showPlanner: boolean;
	showLeaderBoard: boolean;
	showMilestones: boolean;
	showTurnOrder: boolean;
	showGlobalReserve: boolean;
}

type NonToolbarToggleType = "GLOBAL RESERVE";

type GameInterfaceAction = {
	type: "TOGGLE";

	toToggle: ToolbarType | NonToolbarToggleType;
};

function PageGame() {
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
			action: GameInterfaceAction
		): GameInterfaceState => {
			if (action.type === "TOGGLE") {
				let key: keyof GameInterfaceState;
				switch (action.toToggle) {
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

					case "GLOBAL RESERVE":
						key = "showGlobalReserve";
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
			showTurnOrder: false,
			showEmployeeTree: false,
			showPlanner: false,
			showLeaderBoard: false,
			showMilestones: false,
			showGlobalReserve: false
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
	}, [state]);
	if (isMyTurn === null) return <></>;
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
				minimiseIf={!state.showEmployeeTree}
				// TODO: Fix dimension scaling for resizable elements
				scalingType="SCALE"
			>
				<EmployeeTree
					id="employee-tree"
					style={{ width: "1200px" }}
				/>
			</Resizable>

			<Resizable
				minimiseIf={
					turnProgress !== "SALARY_PAYOUTS"
				}
			>
				<SalaryHandler id="game-salary-handler" />
			</Resizable>

			<Resizable
				defaultWidth={300}
				minimiseIf={!state.showTurnOrder}
			>
				<div id="turn-order-list">
					<TurnOrderList />
					<TurnProgressIndicator />
				</div>
			</Resizable>

			<Resizable
				defaultWidth={500}
				minimiseIf={!state.showPlanner}
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

			<GlobalReserveDisplay
				enabledByDefault={state.showGlobalReserve}
				onToggle={() => {
					dispatch({
						type: "TOGGLE",
						toToggle: "GLOBAL RESERVE"
					});
				}}
			/>
		</div>
	);
}

export default PageGame;

