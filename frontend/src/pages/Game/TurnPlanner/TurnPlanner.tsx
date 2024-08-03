import "./TurnPlanner.css";

import { HTMLAttributes, useState } from "react";
import { Employee } from "../../../../../shared/EmployeeTypes";
import ModalPanel from "../../../global_components/ModalPanel";
import { useGameStateView } from "../../../hooks/game/useGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import { GetAllTreeData } from "../../../utils";
import EmployeeCard from "../Employees/EmployeeCard";
import GameActionPreview from "./GameActionPreview";
import HiringWindow from "./HiringWindow";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> {}

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, myEmployees, playerData } =
		useGameStateView();

	const { turnActions, removeAction } = useTurnPlanning();

	const [
		selectedEmployeeIndex,
		setSelectedEmployeeIndex
	] = useState<number | null>(null);

	if (!currentTree || !playerData) return <></>;

	const employees: Employee[] = GetAllTreeData(
		currentTree
	).map((index) => myEmployees[index]);

	// TODO: Clean this up to be more efficient
	function getEventWindow(
		selectedEmployeeIndex: number | null
	) {
		if (
			selectedEmployeeIndex === null ||
			selectedEmployeeIndex < 0 ||
			selectedEmployeeIndex >= employees.length
		)
			return <></>;
		return (
			<ModalPanel
				className="event-window-hiring"
				onClose={() =>
					setSelectedEmployeeIndex(null)
				}
			>
				<HiringWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
				/>
			</ModalPanel>
		);
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
				{getEventWindow(selectedEmployeeIndex)}

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

