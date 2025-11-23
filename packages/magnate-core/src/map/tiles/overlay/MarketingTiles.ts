import { DemandType } from "../../../demand";
import { MarketingType } from "../../../marketing";
import { MapOverlayTileInterface } from "./types";

export type MarketingTile = PartialMarketingTile & {
	demand: DemandType;
	placingEmployee: number;
};

export type PartialMarketingTile =
	| BillBoardMarketingTile
	| MailboxMarketingTile
	| PlaneMarketingTile
	| RadioMarketingTile;

export interface BaseMarketingTile
	extends MapOverlayTileInterface {
	tileType: "MARKETING";

	marketingType: MarketingType;
	tileNumber: number;

	rotation: 0 | 90;
	rotationModulo: 90;
}

export interface BillBoardMarketingTile
	extends BaseMarketingTile {
	marketingType: "BILLBOARD";
}

export interface MailboxMarketingTile
	extends BaseMarketingTile {
	marketingType: "MAILBOX";
}

export interface PlaneMarketingTile
	extends BaseMarketingTile {
	marketingType: "PLANE";
}

export interface RadioMarketingTile
	extends BaseMarketingTile {
	marketingType: "RADIO";
	width: 1;
	height: 1;
}

export const MarketingTilesByNumber: Record<
	number,
	PartialMarketingTile
> = {
	1: createRadioTile(1),
	2: createRadioTile(2),
	3: createRadioTile(3),
	4: createMarketingTile({
		tileNumber: 4,
		width: 2,
		height: 1,
		marketingType: "PLANE"
	}),
	5: createMarketingTile({
		tileNumber: 5,
		width: 3,
		height: 2,
		marketingType: "PLANE"
	}),
	6: createMarketingTile({
		tileNumber: 6,
		width: 4,
		height: 2,
		marketingType: "PLANE"
	}),
	7: createMarketingTile({
		tileNumber: 7,
		width: 2,
		height: 2,
		marketingType: "MAILBOX"
	}),
	8: createMarketingTile({
		tileNumber: 8,
		width: 2,
		height: 2,
		marketingType: "MAILBOX"
	}),
	9: createMarketingTile({
		tileNumber: 9,
		width: 1,
		height: 1,
		marketingType: "MAILBOX"
	}),
	10: createMarketingTile({
		tileNumber: 10,
		width: 1,
		height: 1,
		marketingType: "MAILBOX"
	}),
	11: createMarketingTile({
		tileNumber: 11,
		width: 3,
		height: 2,
		marketingType: "BILLBOARD"
	}),
	12: createMarketingTile({
		tileNumber: 12,
		width: 2,
		height: 2,
		marketingType: "BILLBOARD"
	}),
	13: createMarketingTile({
		tileNumber: 13,
		width: 3,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	14: createMarketingTile({
		tileNumber: 14,
		width: 2,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	15: createMarketingTile({
		tileNumber: 15,
		width: 1,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	16: createMarketingTile({
		tileNumber: 16,
		width: 1,
		height: 1,
		marketingType: "BILLBOARD"
	})
} as const;

interface MarketingTileCreationProps {
	marketingType: MarketingType;
	tileNumber: number;
	width: number;
	height: number;
}

export function createMarketingTile({
	marketingType,
	tileNumber,
	width,
	height
}: MarketingTileCreationProps): PartialMarketingTile {
	if (marketingType === "RADIO")
		return createRadioTile(tileNumber);

	const tile: PartialMarketingTile = {
		level: "OVERLAY",
		tileType: "MARKETING",
		marketingType: marketingType,
		tileNumber: tileNumber,
		width: width,
		height: height,
		pos: { x: 0, y: 0 },
		rotation: 0,
		rotationModulo: 90
	};
	return tile;
}

export function createRadioTile(
	tileNumber: number
): PartialMarketingTile {
	return {
		level: "OVERLAY",
		tileType: "MARKETING",
		marketingType: "RADIO",
		tileNumber: tileNumber,
		rotation: 0,
		width: 1,
		height: 1,
		pos: { x: 0, y: 0 },
		rotationModulo: 90
	};
}
