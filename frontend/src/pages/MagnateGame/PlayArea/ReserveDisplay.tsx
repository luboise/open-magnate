import { HTMLAttributes } from "react";
import { useGameState } from "../../../hooks/useGameState";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {}

function ReserveDisplay({ ...args }: ReserveDisplayProps) {
	const { reserve } = useGameState();

	if (!reserve) return <></>;

	return (
		<div className="game-reserve-display" {...args}>
			{...Object.entries(reserve).map(
				(employeeName, quantity) => (
					<div>
						{employeeName}: {quantity}
					</div>
				)
			)}
		</div>
	);
}

export default ReserveDisplay;

