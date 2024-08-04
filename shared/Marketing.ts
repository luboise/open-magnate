import { MarketingType } from "./EmployeeTypes";

interface MarketingTileCreationProps {
	type: MarketingType;
	tileNumber: number;
	width: number;
	height: number;
}
function createMarketingTile({
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

function createRadioTile(
	tileNumber: number
): RadioMarketingTile {
	return {
		type: "RADIO",
		tileNumber: tileNumber,
		width: 1,
		height: 1
	};
}

interface BaseMarketingTile {
	type: MarketingType;
	tileNumber: number;
	width: number;
	height: number;
}

export interface BillBoardMarketingTile
	extends BaseMarketingTile {
	type: "BILLBOARD";
}

export interface MailboxMarketingTile
	extends BaseMarketingTile {
	type: "MAILBOX";
}

export interface PlaneMarketingTile
	extends BaseMarketingTile {
	type: "PLANE";
}

export interface RadioMarketingTile
	extends BaseMarketingTile {
	type: "RADIO";
	width: 1;
	height: 1;
}

export type MarketingTile =
	| BillBoardMarketingTile
	| MailboxMarketingTile
	| PlaneMarketingTile
	| RadioMarketingTile;

export const MarketingTilesByNumber: Record<
	number,
	MarketingTile
> = {
	1: createRadioTile(1),
	2: createRadioTile(2),
	3: createRadioTile(3),
	4: createMarketingTile({
		tileNumber: 4,
		height: 1,
		width: 2,
		type: "PLANE"
	})
} as const;

