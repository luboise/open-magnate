import { HTMLAttributes } from "react";
import "./GameMapTile.css";
import { MapTile } from "magnate-core/game";

interface MapTileProps
	extends HTMLAttributes<HTMLDivElement> {
	tile: MapTile;
}

function GameMapTile(props: MapTileProps) {
	const { tile, ...args } = props;

	const classes = ["map-tile"];

	if (tile.tileType === "ROAD")
		classes.push("map-tile-road");
	else if (tile.tileType === "HOUSE")
		classes.push("map-tile-house");
	else if (tile.tileType === "DRINK") {
		classes.push(`map-tile-${(tile.drinkType as string).toLowerCase()}`);
	}
	return (
		<div
			{...args}
			className={classes.join(" ")}
			style={{
				gridColumn: `${tile.position.x + 1}`,
				gridRow: `${tile.position.y + 1}`
			}}
		>
			{/* <div className="map-tile-content"> */}
			{/* </div> */}
		</div>
	);
}

export default GameMapTile;
