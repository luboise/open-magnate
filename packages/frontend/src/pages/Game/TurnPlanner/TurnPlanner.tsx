import "./TurnPlanner.css";

import { Employee } from "magnate-core/employees/types";
import { HTMLAttributes, useMemo, useState } from "react";
import CustomPanel from "../../../global_components/CustomPanel";
import { useGameStateView } from "../../../hooks/game/useGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import {
	DemandAction,
	GetAllTreeData
} from "../../../utils";
import EmployeeCard from "../Employees/EmployeeCard";
import DemandSelector from "./DemandSelector";
import GameActionPreview from "./GameActionPreview";
import HiringWindow from "./HiringWindow";
import MarketingWindow from "./MarketingWindow";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> {}

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, myEmployees, playerData } =
		useGameStateView();

	const { turnActions, addAction, removeAction } =
		useTurnPlanning();

	const [
		selectedEmployeeIndex,
		setSelectedEmployeeIndex
	] = useState<number | null>(null);

	if (!currentTree || !playerData) return <></>;

	const employees: Employee[] = GetAllTreeData(
		currentTree
	).map((index) => myEmployees[index]);

	// TODO: Clean this up to be more efficient
	const eventWindow = useMemo((): JSX.Element | null => {
		if (
			selectedEmployeeIndex === null ||
			selectedEmployeeIndex < 0 ||
			selectedEmployeeIndex >= employees.length
		)
			return null;

		const employee = myEmployees[selectedEmployeeIndex];

		if (
			employee.type === "MANAGEMENT" ||
			employee.type === "CEO"
		)
			return (
				<HiringWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
					onClose={clearSelectedEmployee}
				/>
			);

		if (employee.type === "MARKETING")
			return (
				<MarketingWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
				/>
			);

		if (employee.type === "FOOD") {
			if (employee.id === "food_basic")
				return (
					<DemandSelector
						demands={
							employee.supply.demand_type
						}
						onDemandClicked={(demand) => {
							const newAction: Omit<
								DemandAction,
								"player"
							> = {
								type: "GET_DEMAND",
								employeeIndex:
									selectedEmployeeIndex,
								demand: demand,
								amount: employee.supply
									.amount
							};
							addAction(newAction);
							clearSelectedEmployee();
						}}
					/>
				);
		}

		return null;
	}, [selectedEmployeeIndex, myEmployees]);
	function clearSelectedEmployee() {
		setSelectedEmployeeIndex(null);
	}
	// const turnActions: TurnAction[] = [
	// 	{
	// 		player: playerData.playerNumber,
	// 		employeeIndex: 0,
	// 		type: "RECRUIT",
	// 		recruiting: "food_basic"
	// 	},
	// 	{
	// 		player: playerData.playerNumber,
	// 		employeeIndex: 0,
	// 		type: "RECRUIT",
	// 		recruiting: "food_basic"
	// 	}
	// ];

	return (
		<>
			<div className="game-turn-planner" {...args}>
				{eventWindow !== null ? (
					<CustomPanel
						className="event-window"
						onClose={clearSelectedEmployee}
					>
						{eventWindow}
					</CustomPanel>
				) : (
					<></>
				)}

				<div className="game-turn-planner-employee-section">
					<h2>Use your employees!</h2>

					<div className="game-turn-planner-employees">
						{...employees.map(
							(employee, index) => (
								<EmployeeCard
									employee={employee}
									onClick={() =>
										setSelectedEmployeeIndex(
											index
										)
									}
									className={
										selectedEmployeeIndex ===
										index
											? "item-highlighted"
											: undefined
									}
								/>
							)
						)}
					</div>
				</div>
				<div className="game-turn-planner-action-section">
					<div className="game-turn-planner-actions">
						{...turnActions.map(
							(action, index) => (
								<GameActionPreview
									gameAction={action}
									onDestroy={() => {
										removeAction(index);
									}}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default TurnPlanner;
