import { HouseView } from "../../../utils";
import "./House.css";

import { HTMLAttributes } from "react";

interface HouseProps
	extends HTMLAttributes<HTMLDivElement> {
	house: HouseView;
}

function House({
	house,
	className,
	style,
	...args
}: HouseProps) {
	return (
		<div
			className={`map-overlay-tile game-map-house ${className ?? ""}`}
			style={{
				gridColumn: `${house.x + 1} / span 2`,
				gridRow: `${house.y + 1} / span 2`
			}}
			{...args}
		>
			{/* <Image url=""/> */}
			<div
				style={{
					width: "30%",
					aspectRatio: 1,
					border: "0.3em solid black",
					borderRadius: "20%",

					display: "flex",
					alignItems: "center",
					justifyContent: "center",

					color: "black",
					fontSize: "1.5em",
					fontWeight: "bold"
				}}
			>
				{house.priority}
			</div>
		</div>
	);
}

export default House;

