import {
	DEMAND_TYPE,
	MARKETING_TYPE,
	ORIENTATION,
	TURN_PROGRESS as PrismaTurnProgress
} from "@prisma/client";

export interface GameStateView {
	turnProgress: TURN_PROGRESS;
	currentTurn: number;
	currentPlayer: number;

	map: string;
	turnOrder: Array<number> | null;

	playerCount: number;

	houses: HouseView[];
	gardens: GardenView[];

	marketingCampaigns: MarketingCampaignView[];
}

export interface GameStateViewPerPlayer
	extends GameStateView {
	players: GamePlayerView[];

	//  // Relations
	//  houses             House[]

	//  players GamePlayer[]
}

export type TURN_PROGRESS = PrismaTurnProgress;

export type GamePlayerView = {};

export interface MarketingCampaignView extends Position {
	priority: number;

	type: MARKETING_TYPE;

	turnsRemaining: number;
}

export interface HouseView extends Position {
	priority: number;
	demandLimit: number;

	demand: DEMAND_TYPE[];
	garden: GardenView | null;
}

export interface GardenView extends Position {
	houseNumber: number;
}

export interface Position {
	x: number;
	y: number;
	orientation?: ORIENTATION;
}
