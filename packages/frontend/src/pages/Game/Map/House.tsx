import { HouseView } from "../../../utils";
import "./House.css";

import { HTMLAttributes } from "react";
import Demand from "./Tiles/Demand";

interface HouseProps
	extends HTMLAttributes<HTMLDivElement> {
	house: HouseView;
	usePositioning?: boolean;
}

function House({
	house,
	className,
	style,
	usePositioning = true,
	...args
}: HouseProps) {
	return (
		<div
			className={`map-overlay-tile game-map-house ${className ?? ""}`}
			style={{
				...style,
				...(usePositioning
					? {
						gridColumn: `${house.pos.x + 1} / span 2`,
						gridRow: `${house.pos.y + 1} / span 2`
					}
					: {})
			}}
			{...args}
		>
			<div className="game-map-house-demand-box">
				{...house.demand.map((d) => (
					<div className="game-map-house-demand-element">
						<Demand demand={d} />
					</div>
				))}
			</div>

			{/* <Image url=""/> */}
			<div className="house-number-label corner-button">
				{house.priority}
			</div>
		</div>
	);
}

export default House;
