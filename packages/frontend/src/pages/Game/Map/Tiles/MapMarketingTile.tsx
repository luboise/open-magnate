import {
	MarketingTile,
	PartialMarketingTile
} from "magnate-core";
import "./MapMarketingTile.css";

import { HTMLAttributes } from "react";
import GameDemandTile from "../../GlobalUI/DemandPreview";

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
							gridColumn: `${tile.position.x + 1} / span ${tile.width}`,
							gridRow: `${tile.position.y + 1} / span ${tile.height}`,
							width: "100%",
							height: "100%"
						}
						: {})
				}
			}}
			{...args}
		>
			<span>Tile {tile.tileNumber}</span>

			{"demand" in tile ? (
				<GameDemandTile demand={tile.demand} />
			) : (
				<></>
			)}
		</div>
	);
}

export default MapMarketingTile;
