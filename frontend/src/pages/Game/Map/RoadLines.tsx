import "./RoadLines.css";

import { HTMLAttributes } from "react";

interface RoadLinesProps
	extends HTMLAttributes<HTMLDivElement> {
	rotation?: "NORTH" | "EAST" | "SOUTH" | "WEST";
}

function RoadLines({ rotation = "NORTH" }: RoadLinesProps) {
	const rotationString =
		rotation === "NORTH"
			? undefined
			: rotation === "EAST"
				? "90deg"
				: rotation === "SOUTH"
					? "180deg"
					: "270deg";

	return (
		<img
			className="map-road-lines"
			src={`/resources/roadlinesnorth.png`}
			style={{ rotate: rotationString }}
		/>
	);
}

export default RoadLines;

