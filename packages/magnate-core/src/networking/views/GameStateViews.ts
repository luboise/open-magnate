import { EmployeeType } from "@/game/Employee";
import { DemandType } from "@/game/demand";
import { GameMap } from "@/game/map";
import { TurnProgress } from "@/game/state/actions";
import { GameEventView } from "./GameEventViews";
import {
	GardenView,
	HouseView,
	RestaurantView
} from "./MapViews";
import {
	MarketingCampaignView,
	MarketingCampaignViewPrivate
} from "./MarketingViews";

export const ReadyStatuses = [
	"NOT_READY",
	"READY",
	"NOT_APPLICABLE"
] as const;
export type ReadyStatus = (typeof ReadyStatuses)[number];

interface BaseGameStateView {
	turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number | null;

	history: GameEventView[];

	map: GameMap;
	turnOrder: Array<number>;
	realTurnOrder: Array<number | "X">;

	playerCount: number;

	restaurants: RestaurantView[];

	houses: HouseView[];
	gardens: GardenView[];

	reserve: Record<EmployeeType, number>;

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
	employees: EmployeeType[];
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
	status: ReadyStatus
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
