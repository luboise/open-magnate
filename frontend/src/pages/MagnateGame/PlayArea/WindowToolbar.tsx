import "./WindowToolbar.css";

import Button from "../../../components/Button";

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
	function onButtonClicked(clicked: ToolbarType) {
		props.onClick(clicked);
	}
	return (
		<div id="game-window-toolbar">
			{...ToolbarTypes.map((tbt) => (
				<Button
					onClick={() => {
						onButtonClicked(tbt);
					}}
				>
					{tbt}
				</Button>
			))}
		</div>
	);
}

export default WindowToolbar;

