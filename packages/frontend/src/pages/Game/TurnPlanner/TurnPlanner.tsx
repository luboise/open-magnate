import "./TurnPlanner.css";

import { Employee } from "magnate-core/game/Employee";
import { HTMLAttributes, useMemo, useState } from "react";
import CustomPanel from "../../../global_components/CustomPanel";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import EmployeeCard from "../Employees/EmployeeCard";
import DemandSelector from "./DemandSelector";
import GameActionPreview from "./GameActionPreview";
import HiringWindow from "./HiringWindow";
import MarketingWindow from "./MarketingWindow";
import { EmployeeNode } from "magnate-core/game/Employee";
import { DemandAction } from "magnate-core";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> { }

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, employees, privatePlayerData: playerData } =
		useDerivedGameState();

	const { turnActions, addAction, removeAction } =
		useTurnPlanning();

	const [
		selectedEmployeeIndex,
		setSelectedEmployeeIndex
	] = useState<number | null>(null);

	if (!currentTree || !playerData) return <></>;

	const treeEmployees: Employee[] = EmployeeNode.getAllTreeData<number>(
		currentTree
	).map((index) => employees[index]);

	// TODO: Clean this up to be more efficient
	const eventWindow = useMemo((): JSX.Element | null => {
		if (
			selectedEmployeeIndex === null ||
			selectedEmployeeIndex < 0 ||
			selectedEmployeeIndex >= employees.length
		)
			return null;

		const employee = employees[selectedEmployeeIndex];

		if (
			employee.department === "MANAGEMENT" ||
			employee.department === "CEO"
		)
			return (
				<HiringWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
					onClose={clearSelectedEmployee}
				/>
			);

		if (employee.department === "MARKETING")
			return (
				<MarketingWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
				/>
			);

		if (employee.department === "FOOD") {
			if (employee.employeeType === "food_basic")
				return (
					<DemandSelector
						demands={
							employee.supply.demand_type
						}
						onDemandClicked={(demandType) => {
							addAction({
								type: "GET_DEMAND",
								employeeId: selectedEmployeeIndex,
								demand: demandType,
								amount: employee.supply
									.amount
							} satisfies Omit<
								DemandAction,
								"playerIndex"
							>);
							clearSelectedEmployee();
						}}
					/>
				);
		}

		return null;
	}, [selectedEmployeeIndex, employees]);
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
