import { DemandType } from "../../demand/Supply";
import { EmployeeId } from "../../employees";
import { MarketingTile } from "../../map/tiles";

interface BaseGameAction {
	type: string;
	employeeIndex: number;
	player: number;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EmployeeId;
}

export interface MarketingAction extends BaseGameAction {
	type: "MARKETING";
	tile: MarketingTile;
}

export interface DemandAction extends BaseGameAction {
	type: "GET_DEMAND";
	demand: DemandType;
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

export const BASE_SALARY = 5;
