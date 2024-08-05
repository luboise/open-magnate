import { MarketingTile } from "../../../utils";
import "./MapMarketingTile.css";

import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
	tile: MarketingTile;
}

const BASE_TILE_HEIGHT = 50;

function MapMarketingTile({
	tile,
	className,
	style,
	...args
}: Props) {
	return (
		<div
			className={`map-overlay-tile marketing-tile ${className ?? ""}`}
			style={{
				width: `${tile.width * BASE_TILE_HEIGHT}px`,
				height: `${tile.height * BASE_TILE_HEIGHT}px`,
				...style
			}}
			{...args}
		>
			Tile {tile.tileNumber}
		</div>
	);
}

export default MapMarketingTile;

