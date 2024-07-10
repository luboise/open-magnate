import { Colour } from "../frontend/src/utils";
import {
	EMPLOYEE_NAME,
	FOOD_EMPLOYEE_NAME,
	MGMT_EMPLOYEE_NAME
} from "./EmployeeNames";
import { COLOURS } from "./Employees";

interface BaseEmployee {
	id: string;
	name: string;

	type: unknown;
	colour: Colour;
	buildsInto: EMPLOYEE_NAME[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export interface ManagementEmployee extends BaseEmployee {
	type: "MANAGEMENT";
	name: MGMT_EMPLOYEE_NAME;
	capacity: number;
	id: `mgmt_${number}`;
	colour: COLOURS.BLACK;
}
export type FOOD_TYPE =
	| "BURGER"
	| "PIZZA"
	| "BURGER_AND_PIZZA";

export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	name: FOOD_EMPLOYEE_NAME;
	colour: COLOURS.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduced: number;
}

export interface CEOEmployee extends BaseEmployee {
	type: "CEO";
	name: "CEO";
	colour: COLOURS.GREY;
	capacity: number;
	hires: 1;
}

export type Employee =
	| ManagementEmployee
	| FoodEmployee
	| CEOEmployee;

