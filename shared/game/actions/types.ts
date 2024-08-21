import { DEMAND_TYPE } from "../../../backend/src/shareToFront";
import { EMPLOYEE_ID } from "../../employees/types";
import { MarketingTile } from "../../map/tiles";

interface BaseGameAction {
	type: string;
	employeeIndex: number;
	player: number;
}

export interface RecruitAction extends BaseGameAction {
	type: "RECRUIT";
	recruiting: EMPLOYEE_ID;
}

export interface MarketingAction extends BaseGameAction {
	type: "MARKETING";
	tile: MarketingTile;
}

export interface DemandAction extends BaseGameAction {
	type: "GET_DEMAND";
	demand: DEMAND_TYPE;
	amount: number;
}

export type TurnAction =
	| RecruitAction
	| MarketingAction
	| DemandAction;

export const BASE_SALARY = 5;
