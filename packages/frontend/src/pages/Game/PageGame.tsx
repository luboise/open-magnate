import "./PageGame.css";

import { useEffect, useMemo, useReducer } from "react";

import Resizable from "../../global_components/Resizable";
import { useDerivedGameState } from "../../hooks/game/useDerivedGameState";
import useMap from "../../hooks/game/useMap";
import useLocalVal from "../../hooks/useLocalVal";
import usePanning from "../../hooks/usePanning";
import useScalingValue from "../../hooks/useScalingValue";
import EmployeeTree from "./EmployeeTree/EmployeeTree";
import GlobalUI, {
	ToggleableType
} from "./GlobalUI/GlobalUI";
import TurnOrderList from "./GlobalUI/TurnOrderList";
import MagnateMap from "./Map/MagnateMap";
import PlacementHandler from "./Map/Placers/PlacementHandler";
import TilePlacer from "./Map/Placers/TilePlacer";
import SalaryHandler from "./SalaryHandler/SalaryHandler";
import TurnOrderPrompt from "./TurnOrderPrompt/TurnOrderPrompt";
import TurnPlanner from "./TurnPlanner/TurnPlanner";
import TurnProgressIndicator from "./TurnProgressIndicator/TurnProgressIndicator";
import useGameStateView from "../../hooks/game/useGameStateView";
import BankReserveSelector from "./BankReserveSelector/BankReserveSelector";

interface GameInterfaceState {
	showMap: boolean;
	showEmployeeTree: boolean;
	showPlanner: boolean;
	showLeaderBoard: boolean;
	showMilestones: boolean;
	showTurnOrder: boolean;
	showGlobalReserve: boolean;
}

type GameInterfaceAction = {
	type: "TOGGLE";
	toToggle: ToggleableType;
};

function PageGame() {
	const { gameStatus, isMyTurn } = useDerivedGameState();
	const { onMapObjectClicked } = useMap();

	const { gameState } = useGameStateView();
	if (!gameState) return <></>;

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

	const mapConditional: JSX.Element = useMemo(() => {
		if (!isMyTurn) return <></>;

		return (
			<PlacementHandler
				placementTypes={["RESTAURANT", "MARKETING"]}
			/>
		);
	}, [gameStatus, isMyTurn]);

	onMapObjectClicked((event) => {
		if (
			isMyTurn &&
			(gameStatus === "PLACING_FIRST_RESTAURANTS" || gameStatus === "PLACING_FIRST_RESTAURANTS_WAVE_TWO")
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

	// console.debug("Re-rendered main");

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
			<Resizable
				minimiseIf={
					gameStatus !== "SELECTING_BANK_RESERVE" || !isMyTurn
				}
			>
				<BankReserveSelector choices={[100, 200, 300]} id="bank-reserve-selector" />
			</Resizable>

			{state.showMap ? (
				<MagnateMap
					id="magnate-map"
					gameMap={gameState.map}
					style={{
						zIndex: -1,
						...styleProperties
					}}
					onContextMenu={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<TilePlacer />
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
				<EmployeeTree id="employee-tree" />
			</Resizable>

			<Resizable
				minimiseIf={
					gameStatus !== "SALARY_PAYOUTS" || !isMyTurn
				}
			>
				<SalaryHandler id="game-salary-handler" />
			</Resizable>

			<Resizable
				minimiseIf={
					gameStatus !== "SELECTING_TURN_ORDER"
				}
			>
				<TurnOrderPrompt id="turn-order-prompt" />
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

			{/* Global elements */}
			<GlobalUI
				reserveEnabledOnDefault={
					state.showGlobalReserve
				}
				onToggleableClicked={(clicked) => {
					dispatch({
						type: "TOGGLE",
						toToggle: clicked
					});
				}}
			/>
		</div>
	);
}

export default PageGame;
