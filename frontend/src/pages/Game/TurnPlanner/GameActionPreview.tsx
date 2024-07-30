import "./GameActionPreview.css";

import { HTMLAttributes, useMemo } from "react";
import Button from "../../../global_components/Button";
import { useGameState } from "../../../hooks/game/useGameState";
import { EmployeesById, TurnAction } from "../../../utils";

interface GameActionPreviewProps
	extends HTMLAttributes<HTMLDivElement> {
	gameAction: TurnAction;
	onDestroy?: () => void;
}

function GameActionPreview({
	gameAction,
	onDestroy,
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
			{!onDestroy ? (
				<></>
			) : (
				<Button
					onClick={() => {
						onDestroy && onDestroy();
					}}
					className="corner-button"
					style={{
						scale: "0.65",
						transformOrigin: "right top 0",
						backgroundColor: "red",
						color: "black",
						fontWeight: "bold"
					}}
				>
					X
				</Button>
			)}
		</div>
	);
}

export default GameActionPreview;
