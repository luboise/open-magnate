import { EmployeeType, Position } from "../..";
import { DemandType } from "../../demand";
import { MarketingTile } from "../../marketing";

export type ActionType =
	| "RECRUIT"
	| "Train"
	| "MARKETING"
	| "CREATE_DEMAND"
	| "GET_DRINKS";

interface BaseGameAction {
	type: string;
	// The index of the employee in the players inventory
	employeeIndex: number;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EmployeeType;
}

export interface TrainAction extends BaseGameAction {
	type: "TRAIN";
	trainingIndex: number;
	training: EmployeeType;
}

export interface MarketingAction extends BaseGameAction {
	type: "MARKETING";
	tile: MarketingTile;
}

export interface CreateDemandAction extends BaseGameAction {
	type: "CREATE_DEMAND";
	demand: DemandType;
	amount: number;
}

export interface GetDrinksAction extends BaseGameAction {
	type: "GET_DRINKS";
	demand: DemandType;
	path: Position[];
}

export type TurnAction =
	| RecruitAction
	| MarketingAction
	| CreateDemandAction
	| GetDrinksAction
	| TrainAction;

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
