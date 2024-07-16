import { HTMLAttributes } from "react";
import { GameAction } from "../../../../utils";

interface GameActionPreviewProps
	extends HTMLAttributes<HTMLDivElement> {
	gameAction: GameAction;
}

function GameActionPreview({
	gameAction,
	...args
}: GameActionPreviewProps) {
	return (
		<div className="game-action-preview" {...args}>
			<div></div>
		</div>
	);
}

export default GameActionPreview;
