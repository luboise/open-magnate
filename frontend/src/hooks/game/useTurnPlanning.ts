import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";
import { TurnAction } from "../../utils";
import { useGameState } from "./useGameState";

interface GamePlanningState {
	plannedActions: TurnAction[];
}

const gamePlanningAtom = atom<GamePlanningState>({
	key: "gamePlanningAtom",
	default: {
		plannedActions: []
	}
});

const turnActionsSelector = selector<TurnAction[]>({
	key: "turnActions",
	get: ({ get }) => {
		const state = get(gamePlanningAtom);
		return state.plannedActions;
	}
});

function useTurnPlanning() {
	const [turnPlanningState, setTurnPlanningState] =
		useRecoilState(gamePlanningAtom);

	const turnActions = useRecoilValue(turnActionsSelector);

	const { playerData } = useGameState();
	if (!playerData)
		throw new Error("No player data available");

	function addAction(action: Omit<TurnAction, "player">) {
		if (!playerData)
			throw new Error("No player data available");

		const newAction: TurnAction = {
			...action,
			player: playerData.playerNumber
		};

		setTurnPlanningState({
			...turnPlanningState,
			plannedActions: [
				...turnPlanningState.plannedActions,
				newAction
			]
		});
	}

	function removeAction(index: number) {
		if (
			index < 0 ||
			index >= turnPlanningState.plannedActions.length
		)
			throw new Error(
				"Invalid index to remove: " + index
			);

		const newPlannedActions = [
			...turnPlanningState.plannedActions
		].filter((_, i) => i !== index);

		console.debug("Removed action at index " + index);

		setTurnPlanningState({
			...turnPlanningState,
			plannedActions: newPlannedActions
		});
	}

	return {
		turnActions,
		addAction,
		removeAction
	};
}

export default useTurnPlanning;
