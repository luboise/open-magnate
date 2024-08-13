import {
	DEMAND_TYPE,
	Position
} from "../../backend/src/dataViews";
import {
	MarketingTile,
	MarketingTilesByNumber,
	MarketingType
} from "../../frontend/src/utils";

import { MarketingCampaign } from "../../backend/src/shareToFront";

export function CreateMarketingCampaignView(
	campaign: MarketingCampaign
): MarketingCampaignView {
	return {
		playerNumber: campaign.playerNumber,
		priority: campaign.priority,
		turnsRemaining: campaign.turnsRemaining,

		type: campaign.type,
		pos: {
			x: campaign.x,
			y: campaign.y,
			orientation: campaign.orientation
		},
		foodType: campaign.demand
	};
}

export interface MarketingCampaignView {
	priority: number;
	playerNumber: number;

	type: MarketingType;
	foodType: DEMAND_TYPE;

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
