import { READY_STATUS } from "../../backend/src/dataViews";
import {
	GameEventView,
	Map2D,
	TurnProgress
} from "../../frontend/src/utils";
import {
	GardenView,
	HouseView,
	RestaurantView
} from "./MapViews";
import {
	MarketingCampaignView,
	MarketingCampaignViewPrivate
} from "./MarketingViews";

import { DemandType } from "../demand/Supply";
import { EmployeeId } from "../employees/types";

interface BaseGameStateView {
	turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number | null;

	history: GameEventView[];

	map: Map2D;
	turnOrder: Array<number>;
	realTurnOrder: Array<number | "X">;

	playerCount: number;

	restaurants: RestaurantView[];

	houses: HouseView[];
	gardens: GardenView[];

	reserve: Record<EmployeeId, number>;

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
	supply: DemandType[];
}

export interface GamePlayerViewPrivate
	extends GamePlayerViewPublic {
	employees: EmployeeId[];
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
