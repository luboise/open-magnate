import { DemandType } from "../demand";
import { BaseMapTile } from "../map";
import { Position, Rotation } from "../map/area";


export type MarketingType = "BILLBOARD" | "MAILBOX" | "PLANE" | "RADIO";


/// An interface describing the current usage of the tile.
export interface MarketingTileUsageContext  {
	/// The ID of the employee currently in control of this tile. 
	// They will be returned to the player once the
	// marketing campaign ends.
	employeeId: number;
	demand: DemandType;
	durationRemaining: number | "INFINITE";
};

export interface MarketingTile extends BaseMapTile {
	tileType: "MARKETING",

	tileNumber: number;
	marketingType: MarketingType,

	// If this is undefined, the marketing tile is available for use.
	usage?: MarketingTileUsageContext;
};

export const MarketingTile = {


 create({
	marketingType,
	tileNumber,
	width,
	height,
	position = {x: 0, y: 0},
	rotation = 0,
}: MarketingTileCreationProps & {position?: Position, rotation?: Rotation}): MarketingTile {
	return  {
		tileType: "MARKETING",
		marketingType: marketingType,
		tileNumber: tileNumber,
		width,
		height,
		position,
		rotation,
	};
},


 createRadioTile(
	tileNumber: number,
): MarketingTile {
	return {
		tileType: "MARKETING",
		marketingType: "RADIO",
		tileNumber: tileNumber,
		rotation: 0,
		width: 1,
		height: 1,
		position: { x: 0, y: 0 },
	};
},
};


export const MarketingTilesByNumber: Record<
	number,
	MarketingTile
> = {
	1: MarketingTile.createRadioTile(1),
	2: MarketingTile.createRadioTile(2),
	3: MarketingTile.createRadioTile(3),
	4: MarketingTile.create({
		tileNumber: 4,
		width: 2,
		height: 1,
		marketingType: "PLANE"
	}),
	5: MarketingTile.create({
		tileNumber: 5,
		width: 3,
		height: 2,
		marketingType: "PLANE"
	}),
	6: MarketingTile.create({
		tileNumber: 6,
		width: 4,
		height: 2,
		marketingType: "PLANE"
	}),
	7: MarketingTile.create({
		tileNumber: 7,
		width: 2,
		height: 2,
		marketingType: "MAILBOX"
	}),
	8: MarketingTile.create({
		tileNumber: 8,
		width: 2,
		height: 2,
		marketingType: "MAILBOX"
	}),
	9: MarketingTile.create({
		tileNumber: 9,
		width: 1,
		height: 1,
		marketingType: "MAILBOX"
	}),
	10: MarketingTile.create({
		tileNumber: 10,
		width: 1,
		height: 1,
		marketingType: "MAILBOX"
	}),
	11: MarketingTile.create({
		tileNumber: 11,
		width: 3,
		height: 2,
		marketingType: "BILLBOARD"
	}),
	12: MarketingTile.create({
		tileNumber: 12,
		width: 2,
		height: 2,
		marketingType: "BILLBOARD"
	}),
	13: MarketingTile.create({
		tileNumber: 13,
		width: 3,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	14: MarketingTile.create({
		tileNumber: 14,
		width: 2,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	15: MarketingTile.create({
		tileNumber: 15,
		width: 1,
		height: 1,
		marketingType: "BILLBOARD"
	}),
	16: MarketingTile.create({
		tileNumber: 16,
		width: 1,
		height: 1,
		marketingType: "BILLBOARD"
	})
} as const;

interface MarketingTileCreationProps {
	tileNumber: number;
	marketingType: MarketingType;
	width: number;
	height: number;
}
