import "./TurnPlanner.css";

import { HTMLAttributes } from "react";
import { Employee } from "../../../../../shared/EmployeeTypes";
import { useGameState } from "../../../hooks/useGameState";
import { GameAction, GetAllTreeData } from "../../../utils";
import EmployeeCard from "../EmployeeTree/EmployeeCard";
import GameActionPreview from "./GameActionPreview";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> {}

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, myEmployees, playerData } =
		useGameState();
	if (!currentTree || !playerData) return <></>;

	const employees: Employee[] = GetAllTreeData(
		currentTree
	).map((index) => myEmployees[index]);

	const actions: GameAction[] = [
		{
			player: playerData.playerNumber,
			employeeIndex: 0,
			type: "RECRUIT",
			recruiting: "Kitchen Trainee"
		},
		{
			player: playerData.playerNumber,
			employeeIndex: 0,
			type: "RECRUIT",
			recruiting: "Kitchen Trainee"
		}
	];

	return (
		<div className="game-turn-planner" {...args}>
			<div className="game-turn-planner-employee-section">
				<h2>Use your employees!</h2>

				<div className="game-turn-planner-employees">
					{...employees.map((employee) => (
						<EmployeeCard employee={employee} />
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

