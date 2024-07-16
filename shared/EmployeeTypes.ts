import { Colour } from "../frontend/src/utils";
import {
	EMPLOYEE_ID,
	FOOD_EMPLOYEE_ID,
	MGMT_EMPLOYEE_ID
} from "./EmployeeIDs";
import { COLOURS } from "./Employees";

interface BaseEmployee {
	id: string;
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
export type FOOD_TYPE =
	| "BURGER"
	| "PIZZA"
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
}

export type Employee =
	| ManagementEmployee
	| FoodEmployee
	| CEOEmployee;

