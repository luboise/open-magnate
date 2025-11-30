import {
	applyMoveToGamestate,
	EmployeeNode,
	GameState,
	MoveType,
	TurnAction
} from "magnate-core";
import { atom, useRecoilState } from "recoil";
import useGameStateView from "./useGameStateView";

const gamePlanningAtom = atom<GamePlanningState>({
	key: "gamePlanningAtom",
	default: { plannedActions: [] }
});

interface GamePlanningState {
	plannedActions: Record<number, TurnAction[]>;
}

function useTurnPlanning() {
	const { gameState: gameStateView } = useGameStateView();

	const gameState = gameStateView!;

	const [turnPlanningState, setTurnPlanningState] =
		useRecoilState(gamePlanningAtom);

	// const turnActions = useRecoilValue(turnActionsSelector);

	if (!gameState)
		throw new Error("No player data available");

	const player = gameState.players[gameState.playerIndex];

	const allEmployees: number[] =
		EmployeeNode.getAllTreeData<number>(player.tree);

	const unworkedEmployees: number[] = allEmployees.filter(
		(e) => !(e in turnPlanningState.plannedActions)
	);

	function addAction(action: TurnAction) {
		console.debug(
			`Adding action to employee ${action.employeeIndex}:`,
			action
		);

		setTurnPlanningState((oldState) => {
			const newActions = {
				...oldState.plannedActions
			};

			if (!(action.employeeIndex in newActions)) {
				newActions[action.employeeIndex] = [];
			}
			newActions[action.employeeIndex].push(action);

			return {
				...oldState,
				plannedActions: newActions
			};
		});
	}

	function removeActionsByEmployee(
		employeeIndex: number
	) {
		if (
			employeeIndex < 0 ||
			employeeIndex >=
				gameState.privateData.employees.length
		)
			throw new Error(
				"Invalid employee index to remove: " +
					employeeIndex
			);

		setTurnPlanningState((oldState) => {
			const newActions = Object.fromEntries(
				Object.entries(
					oldState.plannedActions
				).filter(
					([k, _]) => Number(k) != employeeIndex
				)
			);

			return {
				...oldState,
				plannedActions: newActions
			};
		});

		console.debug(
			"Removed action at index " + employeeIndex
		);
	}

	function canApplyActions(): boolean {
		const applied = applyMoveToGamestate(
			gameState as unknown as GameState,
			gameState.playerIndex,
			{
				moveType: MoveType.WORK_EMPLOYEES,
				actions: turnPlanningState.plannedActions
			}
		);

		return typeof applied !== "string";
	}

	return {
		allEmployees,
		unworkedEmployees,
		actions: turnPlanningState.plannedActions,
		addAction,
		removeActionsByEmployee,
		canApplyActions
	};
}

export default useTurnPlanning;
