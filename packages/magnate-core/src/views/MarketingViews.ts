import { Position } from "../area/Units";

import { DemandType } from "../demand/Supply";
import {
	MarketingTile,
	MarketingTilesByNumber
} from "../map/tiles";
import { MarketingType } from "../marketing";

export interface MarketingCampaignView {
	priority: number;
	playerNumber: number;

	type: MarketingType;
	foodType: DemandType;

	pos: Position;

	turnsRemaining: number;
}

export interface MarketingCampaignViewPrivate
	extends MarketingCampaignView {
	employeeIndex: number;
}

export function GetMarketingTileFromView(
	campaign: MarketingCampaignView
): MarketingTile {
	const tile = MarketingTilesByNumber[campaign.priority];
	if (!tile)
		throw new Error("Invalid marketing tile priority");

	const rotated = tile.rotation === 90;

	return {
		...tile,
		pos: {
			...campaign.pos
		},
		placingEmployee: campaign.priority,
		rotation: rotated ? 90 : 0,
		width: rotated ? tile.height : tile.width,
		height: rotated ? tile.width : tile.height,
		marketingType: campaign.type,
		demand: campaign.foodType
	} as MarketingTile;
	// TODO: Fix the typing here and remove the as
}
