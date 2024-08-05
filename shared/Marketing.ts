import { MarketingType } from "./EmployeeTypes";
import {
	MarketingTile,
	RadioMarketingTile
} from "./MapTiles/MarketingTiles";

interface MarketingTileCreationProps {
	type: MarketingType;
	tileNumber: number;
	width: number;
	height: number;
}
export function createMarketingTile({
	type,
	tileNumber,
	width,
	height
}: MarketingTileCreationProps): MarketingTile {
	if (type === "RADIO")
		return createRadioTile(tileNumber);

	const tile: MarketingTile = {
		type: type,
		tileNumber: tileNumber,
		width: width,
		height: height
	};

	return tile;
}

export function createRadioTile(
	tileNumber: number
): RadioMarketingTile {
	return {
		type: "RADIO",
		tileNumber: tileNumber,
		width: 1,
		height: 1
	};
}

