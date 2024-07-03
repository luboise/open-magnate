import {
	DEMAND_TYPE,
	MARKETING_TYPE,
	ORIENTATION,
	TURN_PROGRESS as PrismaTurnProgress
} from "@prisma/client";
import { RESTAURANT_NAME } from "../../shared";

interface BaseGameStateView {
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

export interface GameStateView extends BaseGameStateView {
	players: GamePlayerViewPrivate[];
}

export interface GameStateViewPerPlayer
	extends BaseGameStateView {
	players: GamePlayerViewPublic[];

	// The player's private data
	privateData: GamePlayerViewPrivate;
}

export interface GamePlayerViewPublic {
	playerNumber: number;
	milestones: number[];
	restaurant: RESTAURANT_NAME;
	money: number;
}

export interface GamePlayerViewPrivate
	extends GamePlayerViewPublic {
	employees: number[];
}

export type TURN_PROGRESS = PrismaTurnProgress;

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
