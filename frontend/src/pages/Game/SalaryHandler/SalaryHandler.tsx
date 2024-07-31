import "./SalaryHandler.css";

import { HTMLAttributes, useMemo, useReducer } from "react";
import Button from "../../../global_components/Button";
import { useGameState } from "../../../hooks/game/useGameState";
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
	const { myEmployees } = useGameState();

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

	return (
		<div className={`game-salary-handler`} {...args}>
			<div className="game-salary-handler-main"></div>
			<div className="game-salary-handler-receipt-summary">
				receipt top
			</div>
			<div className="game-salary-handler-receipt-total">
				<Button onClick={alert}>
					${salaryOwed}
				</Button>
			</div>
		</div>
	);
}

export default SalaryHandler;
