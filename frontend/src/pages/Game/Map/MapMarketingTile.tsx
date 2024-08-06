import {
	MarketingTile,
	PartialMarketingTile
} from "../../../utils";
import "./MapMarketingTile.css";

import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
	tile: PartialMarketingTile | MarketingTile;
	snapToGrid?: boolean;
}

const BASE_TILE_HEIGHT = 50;

function MapMarketingTile({
	tile,
	className,
	style,
	snapToGrid = false,
	...args
}: Props) {
	return (
		<div
			className={`map-overlay-tile marketing-tile ${className ?? ""}`}
			style={{
				width: `${tile.width * BASE_TILE_HEIGHT}px`,
				height: `${tile.height * BASE_TILE_HEIGHT}px`,
				...style,
				...{
					...(snapToGrid
						? {
								gridColumn: `${tile.pos.x + 1} / span ${tile.width}`,
								gridRow: `${tile.pos.y + 1} / span ${tile.height}`,
								width: "100%",
								height: "100%"
							}
						: {})
				}
			}}
			{...args}
		>
			Tile {tile.tileNumber}
		</div>
	);
}

export default MapMarketingTile;

