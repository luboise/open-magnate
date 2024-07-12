import "./WindowToolbar.css";

import Button from "../../../components/Button";
import { useGameState } from "../../../hooks/useGameState";

interface WindowToolbarProps {
	onClick: (clicked: ToolbarType) => void;
}

export type ToolbarType = (typeof ToolbarTypes)[number];

const ToolbarTypes = [
	"MAP",
	"EMPLOYEE TREE",
	"PLANNER",
	"LEADERBOARD",
	"MILETONES",
	"TURN ORDER"
] as const;

function WindowToolbar(props: WindowToolbarProps) {
	const { turnProgress, isMyTurn } = useGameState();

	function onButtonClicked(clicked: ToolbarType) {
		props.onClick(clicked);
	}

	return (
		<div id="game-window-toolbar">
			{...ToolbarTypes.map((tbt) => {
				let highlighted = false;

				if (isMyTurn && turnProgress) {
					if (
						(turnProgress === "RESTRUCTURING" &&
							tbt === "EMPLOYEE TREE") ||
						(turnProgress === "USE_EMPLOYEES" &&
							tbt === "PLANNER")
					)
						highlighted = true;
				}

				return (
					<Button
						onClick={() => {
							onButtonClicked(tbt);
						}}
						className={
							highlighted
								? "glowing"
								: undefined
						}
					>
						{tbt}
					</Button>
				);
			})}
		</div>
	);
}

export default WindowToolbar;
