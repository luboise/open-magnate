import {
	GardenView,
	HouseView,
	MarketingCampaignView,
	MarketingCampaignViewPrivate,
	READY_STATUS,
	RestaurantView
} from "../../backend/src/dataViews";
import { TURN_PROGRESS } from "../../frontend/src/utils";

import { EMPLOYEE_ID } from "../EmployeeIDs";

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

export function parseTurnOrder(
	serialisedTurnOrder: string
): (number | null)[] {
	return serialisedTurnOrder
		.split("")
		.map((str) => (str === "X" ? null : Number(str)));
}
export function serialiseTurnOrder(
	turnOrder: (number | null)[]
): string {
	return turnOrder
		.map((player) =>
			player === null ? "X" : player.toString()
		)
		.join("");
}
export function ReadyStatusToBoolean(
	status: READY_STATUS
): boolean | null {
	switch (status) {
		case "READY":
			return true;
		case "NOT_READY":
			return false;
		default:
			return null;
	}
}

