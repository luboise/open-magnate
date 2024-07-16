import { useState } from "react";
import Button from "../../../components/Button";
import "./GlobalReserveDisplay.css";

import ReserveDisplay from "./ReserveDisplay";

function GlobalReserveDisplay() {
	const [collapsed, setCollapsed] =
		useState<boolean>(false);

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
					setCollapsed(!collapsed);
				}}
			>
				{" "}
				Reserve
			</Button>
			<ReserveDisplay />
		</div>
	);
}

export default GlobalReserveDisplay;

