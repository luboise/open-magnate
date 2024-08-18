import { DEMAND_TYPE } from "../../backend/src/dataViews";
import { Colour } from "../../frontend/src/utils";
import {
	EMPLOYEE_ID,
	FOOD_EMPLOYEE_ID,
	MGMT_EMPLOYEE_ID,
	WAITRESS_ID as WAITRESS_EMPLOYEE_ID
} from "./EmployeeIDs";
import { COLOURS } from "./Employees";

export interface BaseEmployee {
	id: EMPLOYEE_ID | "CEO";
	name: string;

	type: unknown;
	colour: Colour;
	buildsInto: EMPLOYEE_ID[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export interface ManagementEmployee extends BaseEmployee {
	type: "MANAGEMENT";
	id: MGMT_EMPLOYEE_ID;
	colour: COLOURS.BLACK;
	capacity: number;
}

export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	id: FOOD_EMPLOYEE_ID;
	colour: COLOURS.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduced: number;
}

export interface CEOEmployee extends BaseEmployee {
	type: "CEO";
	name: "CEO";
	id: "CEO";
	colour: COLOURS.GREY;
	capacity: number;
	notPaid: true;
}

export interface WaitressEmployee extends BaseEmployee {
	type: "WAITRESS";
	id: WAITRESS_EMPLOYEE_ID;
}

export type Employee =
	| ManagementEmployee
	| FoodEmployee
	| MarketingEmployee
	| CEOEmployee
	| WaitressEmployee;

export interface ManagementEmployee extends BaseEmployee {
	type: "MANAGEMENT";
	id: MGMT_EMPLOYEE_ID;
	colour: COLOURS.BLACK;
	capacity: number;
}

export type FOOD_TYPE =
	| Extract<DEMAND_TYPE, "BURGER" | "PIZZA">
	| "BURGER_AND_PIZZA";

export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	id: FOOD_EMPLOYEE_ID;
	colour: COLOURS.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduced: number;
}

export interface CEOEmployee extends BaseEmployee {
	type: "CEO";
	name: "CEO";
	id: "CEO";
	colour: COLOURS.GREY;
	capacity: number;
	notPaid: true;
}

export interface MarketingEmployee extends BaseEmployee {
	type: "MARKETING";
	id: MARKETING_EMPLOYEE_ID;
	colour: COLOURS.LIGHT_BLUE;
	marketingType: MarketingType;
}

export interface WaitressEmployee extends BaseEmployee {
	type: "WAITRESS";
	id: WAITRESS_EMPLOYEE_ID;
}
