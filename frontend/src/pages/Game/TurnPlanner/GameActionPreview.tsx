import "./GameActionPreview.css";

import { HTMLAttributes } from "react";
import { useGameState } from "../../../hooks/game/useGameState";
import { TurnAction } from "../../../utils";

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

	return (
		<div className="game-action-preview" {...args}>
			<div
				style={{ backgroundColor: employee.colour }}
			>
				{employee.name}
			</div>
			<div>{gameAction.type}</div>
			<div>implement specific details here</div>
		</div>
	);
}

export default GameActionPreview;
