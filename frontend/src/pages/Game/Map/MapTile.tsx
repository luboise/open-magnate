import { HTMLAttributes, ReactNode, useMemo } from "react";
import {
	DirectionBools,
	MapTileData,
	TileType
} from "../../../utils";
import "./MapTile.css";
import RoadTileElements from "./RoadTileElements";

interface MapTileProps
	extends HTMLAttributes<HTMLDivElement> {
	tile: MapTileData;
}

function MapTile(props: MapTileProps) {
	const { tile: tileData, ...args } = props;

	const tileElements = useMemo((): ReactNode => {
		if (!tileData) return <p>invalid map tile</p>;

		if (tileData.tileType === TileType.ROAD)
			return (
				<RoadTileElements
					roadDirections={tileData.adjacentRoads}
				/>
			);

		// // Check if has valid image
		// if (tileData.tileType !== TileType.EMPTY) {
		// 	elements.push(
		// 		<img
		// 			src={`/resources/${tileData.tileType}.png`}
		// 		/>
		// 	);
		// }

		return <></>;
	}, [tileData, tileData.tileType]);

	const classes = ["map-tile"];
	for (const direction of [
		"north",
		"south",
		"east",
		"west"
	]) {
		if (
			tileData.pieceEdges[
				direction as keyof DirectionBools
			]
		)
			classes.push(`tile-boundary-${direction}`);
	}

	if (tileData.tileType === TileType.EMPTY)
		classes.push("map-tile-empty");
	else if (tileData.tileType === TileType.ROAD)
		classes.push("map-tile-road");
	else if (tileData.tileType === TileType.HOUSE)
		classes.push("map-tile-house");
	else if (tileData.tileType === TileType.LEMONADE)
		classes.push("map-tile-lemonade");
	else if (tileData.tileType === TileType.COLA)
		classes.push("map-tile-cola");
	else if (tileData.tileType === TileType.BEER)
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

