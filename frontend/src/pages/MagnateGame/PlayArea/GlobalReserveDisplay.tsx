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
				translate: collapsed
					? "100% 0%"
					: undefined,
				transition: "translate 0.15s linear"
			}}
		>
			<Button
				onClick={() => {
					setCollapsed(!collapsed);
				}}
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					translate: "-100% 0%",
					height: "100%"
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

