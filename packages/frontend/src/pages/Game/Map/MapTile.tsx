import { HTMLAttributes, ReactNode, useMemo } from "react";
import { MapAnyTile } from "../../../utils";
import "./MapTile.css";
import RoadTileElements from "./RoadTileElements";

interface MapTileProps
	extends HTMLAttributes<HTMLDivElement> {
	tile: MapAnyTile;
}

function MapTile(props: MapTileProps) {
	const { tile: tileData, ...args } = props;

	const tileElements = useMemo((): ReactNode => {
		if (!tileData) return <p>invalid map tile</p>;

		if (tileData.tileType === "ROAD")
			return (
				<RoadTileElements
					roadDirections={tileData.adjacentRoads}
				/>
			);

		// // Check if has valid image
		// if (tileData.tileType !== "EMPTY") {
		// 	elements.push(
		// 		<img
		// 			src={`/resources/${tileData.tileType}.png`}
		// 		/>
		// 	);
		// }

		return <></>;
	}, [tileData, tileData.tileType]);

	const classes = ["map-tile"];
	/**
	for (const direction of [
		"north",
		"south",
		"east",
		"west"
	]) {
		if (tileData.pieceEdges[direction])
			classes.push(`tile-boundary-${direction}`);
	}
**/
	if (tileData.tileType === "EMPTY")
		classes.push("map-tile-empty");
	else if (tileData.tileType === "ROAD")
		classes.push("map-tile-road");
	else if (tileData.tileType === "HOUSE")
		classes.push("map-tile-house");
	else if (tileData.tileType === "LEMONADE")
		classes.push("map-tile-lemonade");
	else if (tileData.tileType === "COLA")
		classes.push("map-tile-cola");
	else if (tileData.tileType === "BEER")
		classes.push("map-tile-beer");
	return (
		<div
			{...args}
			className={classes.join(" ")}
			style={{
				gridColumn: `${tileData.pos.x + 1}`,
				gridRow: `${tileData.pos.y + 1}`
			}}
		>
			{/* <div className="map-tile-content"> */}
			{tileElements}
			{/* </div> */}
		</div>
	);
}

export default MapTile;
