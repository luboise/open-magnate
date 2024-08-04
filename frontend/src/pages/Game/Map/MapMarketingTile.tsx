import "./MapMarketingTile.css";

import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
	tileNumber: number;
}

function MapMarketingTile({ tileNumber, ...args }: Props) {
	return <div {...args}>Tile {tileNumber}</div>;
}

export default MapMarketingTile;

