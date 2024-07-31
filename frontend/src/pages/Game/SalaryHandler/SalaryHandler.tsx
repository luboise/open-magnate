import "./SalaryHandler.css";

import { HTMLAttributes, useMemo, useReducer } from "react";
import { MOVE_TYPE } from "../../../../../shared/Moves";
import Button from "../../../global_components/Button";
import { useGameState } from "../../../hooks/game/useGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import { BASE_SALARY } from "../../../utils";

interface State {
	employeesToRemove: number[];
}

interface Action {
	type: "ADD_EMPLOYEE" | "REMOVE_EMPLOYEE";
	payload: number;
}

interface Props extends HTMLAttributes<HTMLDivElement> {}
function SalaryHandler({ ...args }: Props) {
	const { myEmployees, playerData } = useGameState();

	const { makeMove } = usePageGame();

	const [state, dispatch] = useReducer(
		(state: State, action: Action): State => {
			switch (action.type) {
				case "ADD_EMPLOYEE":
					return {
						...state,
						employeesToRemove: [
							...state.employeesToRemove,
							action.payload
						]
					};
				case "REMOVE_EMPLOYEE":
					return {
						...state,
						employeesToRemove:
							state.employeesToRemove.filter(
								(e) => e !== action.payload
							)
					};
				default:
					return state;
			}
		},
		{
			employeesToRemove: []
		}
	);

	const salaryOwed = useMemo(() => {
		return myEmployees
			.filter(
				(_, index) =>
					!state.employeesToRemove.includes(index)
			)
			.reduce(
				(salary, e) =>
					salary + (e.notPaid ? 0 : BASE_SALARY),
				0
			);
	}, [myEmployees, state.employeesToRemove]);

	if (!playerData) return <></>;

	const finalBalance: number =
		playerData.money - salaryOwed;
	const payable: boolean = finalBalance >= 0;

	return (
		<div className={`game-salary-handler`} {...args}>
			<div className="game-salary-handler-main"></div>
			<div className="game-salary-handler-receipt-summary">
				receipt top
			</div>
			<div className="game-salary-handler-receipt-total">
				<Button
					onClick={() => {
						makeMove({
							MoveType:
								MOVE_TYPE.NEGOTIATE_SALARIES,
							employeesToFire:
								state.employeesToRemove
						});
					}}
					inactive={!payable}
					inactiveHoverText={`This would result in a balance of -$${Math.abs(finalBalance)}. You must fire some employees to continue.`}
				>
					${salaryOwed}
				</Button>
			</div>
		</div>
	);
}

export default SalaryHandler;

