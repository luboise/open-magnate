import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

function TurnOrderPrompt({ ...args }: Props) {
	return (
		<div className="turn-order-prompt" {...args}>
			TurnOrderPrompt
		</div>
	);
}

export default TurnOrderPrompt;

