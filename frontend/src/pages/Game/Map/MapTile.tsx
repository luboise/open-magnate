import { ReactNode, useMemo } from "react";
import {
	DirectionBools,
	MapTileData,
	TileType
} from "../../../utils";
import "./MapTile.css";
import RoadTileElements from "./RoadTileElements";

interface MapTileProps
	extends React.HTMLAttributes<HTMLDivElement> {
	tile: MapTileData;
}

function MapTile(props: MapTileProps) {
	const { tile: tileData, ...args } = props;

	const tileElements = useMemo((): ReactNode => {
		if (!tileData) return <p>invalid map tile</p>;

		if (tileData.type === TileType.ROAD)
			return (
				<RoadTileElements
					roadDirections={
						tileData.data as DirectionBools
					}
				/>
			);

		// // Check if has valid image
		// if (tileData.type !== TileType.EMPTY) {
		// 	elements.push(
		// 		<img
		// 			src={`/resources/${tileData.type}.png`}
		// 		/>
		// 	);
		// }

		return <></>;
	}, [tileData, tileData.type]);

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

	if (tileData.type === TileType.EMPTY)
		classes.push("map-tile-empty");
	else if (tileData.type === TileType.ROAD)
		classes.push("map-tile-road");
	else if (tileData.type === TileType.HOUSE)
		classes.push("map-tile-house");
	else if (tileData.type === TileType.LEMONADE)
		classes.push("map-tile-lemonade");
	else if (tileData.type === TileType.COLA)
		classes.push("map-tile-cola");
	else if (tileData.type === TileType.BEER)
		classes.push("map-tile-beer");
	return (
		<div
			{...args}
			className={classes.join(" ")}
			style={{
				gridColumn: `${tileData.x + 1}`,
				gridRow: `${tileData.y + 1}`
			}}
		>
			{/* <div className="map-tile-content"> */}
			{tileElements}
			{/* </div> */}
		</div>
	);
}

export default MapTile;

