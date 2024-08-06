import { atom, useRecoilState } from "recoil";
import {
	MarketingAction,
	RecruitAction,
	TurnAction
} from "../../utils";
import { useGameStateView } from "./useGameState";

interface GamePlanningState {
	plannedActions: TurnAction[];
}

const gamePlanningAtom = atom<GamePlanningState>({
	key: "gamePlanningAtom",
	default: {
		plannedActions: []
	}
});

// const turnActionsSelector = selector<TurnAction[]>({
// 	key: "turnActions",
// 	get: ({ get }) => {
// 		const state = get(gamePlanningAtom);
// 		return state.plannedActions;
// 	}
// });

function useTurnPlanning() {
	const [turnPlanningState, setTurnPlanningState] =
		useRecoilState(gamePlanningAtom);

	// const turnActions = useRecoilValue(turnActionsSelector);

	const { playerData } = useGameStateView();
	if (!playerData)
		throw new Error("No player data available");

	function addAction(action: Omit<TurnAction, "player">) {
		if (!playerData)
			throw new Error("No player data available");

		const newAction = ((): TurnAction | null => {
			if (action.type === "RECRUIT") {
				return {
					...(action as Omit<
						RecruitAction,
						"player"
					>),
					player: playerData.playerNumber
				};
			} else if (action.type === "MARKETING") {
				return {
					...(action as Omit<
						MarketingAction,
						"player"
					>),
					player: playerData.playerNumber
				};
			}

			return null;
		})();

		if (!newAction) {
			console.debug("Unable to add action: ", action);
			return;
		}

		console.debug(
			"NEW ACTION: ",
			newAction,
			"OLD LIST: ",
			turnPlanningState.plannedActions
		);

		setTurnPlanningState((oldState) => ({
			...oldState,
			plannedActions: [
				...oldState.plannedActions,
				newAction
			]
		}));

		// setNewAction({ action: newAction });
	}

	function removeAction(index: number) {
		if (
			index < 0 ||
			index >= turnPlanningState.plannedActions.length
		)
			throw new Error(
				"Invalid index to remove: " + index
			);

		setTurnPlanningState((oldState) => ({
			...oldState,
			plannedActions: [
				...oldState.plannedActions
			].filter((_, i) => i !== index)
		}));

		console.debug("Removed action at index " + index);
	}

	return {
		turnActions: turnPlanningState.plannedActions,
		addAction,
		removeAction
	};
}

export default useTurnPlanning;

