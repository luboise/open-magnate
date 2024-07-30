import "./GameActionPreview.css";

import { HTMLAttributes, useMemo } from "react";
import { useGameState } from "../../../hooks/game/useGameState";
import { EmployeesById, TurnAction } from "../../../utils";

interface GameActionPreviewProps
	extends HTMLAttributes<HTMLDivElement> {
	gameAction: TurnAction;
}

function GameActionPreview({
	gameAction,
	...args
}: GameActionPreviewProps) {
	const { myEmployees } = useGameState();

	const employee = myEmployees[gameAction.employeeIndex];

	const details = useMemo(() => {
		switch (gameAction.type) {
			case "RECRUIT":
				return `Hired ${EmployeesById[gameAction.recruiting].name}`;
			default:
				return "";
		}
	}, [gameAction, myEmployees]);

	return (
		<div className="game-action-preview" {...args}>
			<div
				style={{ backgroundColor: employee.colour }}
			>
				{employee.name}
			</div>
			<div>{gameAction.type}</div>
			<div>{details}</div>
		</div>
	);
}

export default GameActionPreview;
