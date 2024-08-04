import { useGameStateView } from "../../../hooks/game/useGameState";
import "./TurnOrderPrompt.css";

import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

function TurnOrderPrompt({ ...args }: Props) {
	const { turnOrder } = useGameStateView();

	return (
		<div className="turn-order-prompt" {...args}>
			<h2>Choose Turn Order</h2>
			<h3>Pick Order:</h3>
			<div className="players"></div>
			<div className="picks">
				{...new Array(turnOrder.length)
					.fill(null)
					.map((i, index) => (
						<div>{index + 1}</div>
					))}
			</div>
		</div>
	);
}

export default TurnOrderPrompt;

