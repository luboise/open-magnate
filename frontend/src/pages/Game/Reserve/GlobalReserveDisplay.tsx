import { useState } from "react";
import Button from "../../../global_components/Button";
import "./GlobalReserveDisplay.css";
import ReserveDisplay from "./ReserveDisplay";

interface GlobalReserveDisplayProps {
	enabledByDefault: boolean;
	onToggle?: () => void;
}

function GlobalReserveDisplay({
	enabledByDefault,
	onToggle
}: GlobalReserveDisplayProps) {
	const [collapsed, setCollapsed] = useState<boolean>(
		!enabledByDefault
	);

	return (
		<div
			id="game-global-reserve-display"
			style={{
				translate: collapsed ? "100% 0%" : undefined
			}}
		>
			<Button
				id="game-global-reserve-collapse-btn"
				onClick={() => {
					setCollapsed(() => !collapsed);
					if (onToggle) onToggle();
				}}
			>
				{" "}
				Reserve
			</Button>
			<ReserveDisplay id="global-reserve-display" />
		</div>
	);
}

export default GlobalReserveDisplay;
