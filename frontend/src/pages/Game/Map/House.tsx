import { HouseView } from "../../../utils";
import "./House.css";

import { HTMLAttributes } from "react";
import Demand from "./Tiles/Demand";

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
				gridColumn: `${house.pos.x + 1} / span 2`,
				gridRow: `${house.pos.y + 1} / span 2`
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
				<div className="game-map-house-demand-box">
					{...house.demand.map((d) => (
						<Demand demand={d} />
					))}
				</div>
			</div>
		</div>
	);
}

export default House;
