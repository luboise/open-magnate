import { MarketingType } from "../EmployeeTypes";
import {
	createMarketingTile,
	createRadioTile
} from "../Marketing";

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
		width: 2,
		height: 1,
		type: "PLANE"
	}),
	5: createMarketingTile({
		tileNumber: 5,
		width: 3,
		height: 2,
		type: "PLANE"
	}),
	6: createMarketingTile({
		tileNumber: 6,
		width: 4,
		height: 2,
		type: "PLANE"
	}),
	7: createMarketingTile({
		tileNumber: 7,
		width: 2,
		height: 2,
		type: "MAILBOX"
	}),
	8: createMarketingTile({
		tileNumber: 8,
		width: 2,
		height: 2,
		type: "MAILBOX"
	}),
	9: createMarketingTile({
		tileNumber: 9,
		width: 1,
		height: 1,
		type: "MAILBOX"
	}),
	10: createMarketingTile({
		tileNumber: 10,
		width: 1,
		height: 1,
		type: "MAILBOX"
	}),
	11: createMarketingTile({
		tileNumber: 11,
		width: 3,
		height: 2,
		type: "BILLBOARD"
	}),
	12: createMarketingTile({
		tileNumber: 12,
		width: 2,
		height: 2,
		type: "BILLBOARD"
	}),
	13: createMarketingTile({
		tileNumber: 13,
		width: 3,
		height: 1,
		type: "BILLBOARD"
	}),
	14: createMarketingTile({
		tileNumber: 14,
		width: 2,
		height: 1,
		type: "BILLBOARD"
	}),
	15: createMarketingTile({
		tileNumber: 15,
		width: 1,
		height: 1,
		type: "BILLBOARD"
	}),
	16: createMarketingTile({
		tileNumber: 16,
		width: 1,
		height: 1,
		type: "BILLBOARD"
	})
} as const;

