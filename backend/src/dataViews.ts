import {
	ORIENTATION,
	DEMAND_TYPE as PrismaDemandType,
	ENTRANCE_CORNER as PrismaEntranceCorner,
	MARKETING_TYPE as PrismaMarketingType,
	TURN_PROGRESS as PrismaTurnProgress
} from "@prisma/client";
import { EMPLOYEE_ID } from "../../shared";

export const TURN_PROGRESS_VALUES: TURN_PROGRESS[] =
	Object.values(PrismaTurnProgress);

export type TURN_PROGRESS = PrismaTurnProgress;

export type ENTRANCE_CORNER = PrismaEntranceCorner;
export type DEMAND_TYPE = PrismaDemandType;

export type MarketingType = PrismaMarketingType;

export interface RestaurantView extends Position {
	player: number;
}

interface BaseGameStateView {
	turnProgress: TURN_PROGRESS;
	currentTurn: number;
	currentPlayer: number | null;

	map: string;
	turnOrder: Array<number>;

	playerCount: number;

	restaurants: RestaurantView[];

	houses: HouseView[];
	gardens: GardenView[];

	reserve: Record<EMPLOYEE_ID, number>;

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
	restaurant: number;
	money: number;
	ready: boolean | null;
}

export interface GamePlayerViewPrivate
	extends GamePlayerViewPublic {
	employees: string[];
	employeeTreeStr: string;
	marketingCampaigns: MarketingCampaignViewPrivate[];
}

export interface MarketingCampaignView extends Position {
	priority: number;
	playerNumber: number;

	type: MarketingType;

	turnsRemaining: number;
}

export interface MarketingCampaignViewPrivate
	extends MarketingCampaignView {
	employeeIndex: number;
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

