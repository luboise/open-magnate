import { EmployeeType } from "../..";
import { DemandType } from "../../demand";
import { MarketingTile } from "../../marketing";

export type ActionType =
	| "RECRUIT"
	| "MARKETING"
	| "GET_DEMAND";

interface BaseGameAction {
	type: string;
	employeeId: number;
	playerIndex: number;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EmployeeType;
}

export interface MarketingAction extends BaseGameAction {
	type: "MARKETING";
	tile: MarketingTile;
}

export interface DemandAction extends BaseGameAction {
	type: "GET_DEMAND";
	demandType: DemandType;
	amount: number;
}

export type TurnAction =
	| RecruitAction
	| MarketingAction
	| DemandAction;

export const TurnProgressValues = [
	"PREGAME",
	"SETTING_UP",
	"RESTAURANT_PLACEMENT",
	"RESTRUCTURING",
	"TURN_ORDER_SELECTION",
	"USE_EMPLOYEES",
	"SALARY_PAYOUTS",
	"MARKETING_CAMPAIGNS",
	"CLEAN_UP",
	"POSTGAME"
] as const;
export type TurnProgress =
	(typeof TurnProgressValues)[number];
