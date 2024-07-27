import "./TurnPlanner.css";

import { HTMLAttributes, useState } from "react";
import { Employee } from "../../../../../shared/EmployeeTypes";
import ModalPanel from "../../../global_components/ModalPanel";
import { useGameState } from "../../../hooks/useGameState";
import { GameAction, GetAllTreeData } from "../../../utils";
import EmployeeCard from "../EmployeeTree/EmployeeCard";
import GameActionPreview from "./GameActionPreview";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> {}

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, myEmployees, playerData } =
		useGameState();

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
				onClose={() =>
					setSelectedEmployeeIndex(null)
				}
			>
				Employee stuff here
			</ModalPanel>
		);
	}

	const actions: GameAction[] = [
		{
			player: playerData.playerNumber,
			employeeIndex: 0,
			type: "RECRUIT",
			recruiting: "food_basic"
		},
		{
			player: playerData.playerNumber,
			employeeIndex: 0,
			type: "RECRUIT",
			recruiting: "food_basic"
		}
	];

	return (
		<div className="game-turn-planner" {...args}>
			<div className="game-turn-planner-employee-section">
				<h2>Use your employees!</h2>

				<div className="game-turn-planner-employees">
					{getEventWindow(selectedEmployeeIndex)}
					{...employees.map((employee, index) => (
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
					))}
				</div>
			</div>
			<div className="game-turn-planner-action-section">
				<div className="game-turn-planner-actions">
					{...actions.map((action) => (
						<GameActionPreview
							gameAction={action}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default TurnPlanner;

