import "./House.css";

import { HTMLAttributes } from "react";
import GameDemandTile from "../GlobalUI/DemandPreview";
import { HouseTile, DemandRecord } from "magnate-core";

interface HouseProps
	extends HTMLAttributes<HTMLDivElement> {
	house: HouseTile;
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
						gridColumn: `${house.position.x + 1} / span 2`,
						gridRow: `${house.position.y + 1} / span 2`
					}
					: {})
			}}
			{...args}
		>
			<div className="game-map-house-demand-box">
				{...DemandRecord.toDemands(house.demand).map((d) => (
					<div className="game-map-house-demand-element">
						<GameDemandTile demand={d} />
					</div>
				))}
			</div>

			{/* <Image url=""/> */}
			<div className="house-number-label corner-button">
				{house.houseNumber}
			</div>
		</div>
	);
}

export default House;
