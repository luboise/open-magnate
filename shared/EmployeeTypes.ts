import { Colour } from "../frontend/src/utils";
import {
	EMPLOYEE_NAME,
	MANAGEMENT_NAME
} from "./EmployeeNames";
import { COLOURS } from "./Employees";

interface BaseEmployee {
	name: EMPLOYEE_NAME;
	id: string;

	type: unknown;
	colour: Colour;
	buildsInto: EMPLOYEE_NAME[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export interface ManagementEmployee extends BaseEmployee {
	type: "MANAGEMENT";
	name: MANAGEMENT_NAME;
	capacity: number;
	id: `mgmt_${number}`;
	colour: COLOURS.BLACK;
}
export type FOOD_TYPE =
	| "BURGER"
	| "PIZZA"
	| "BURGER_AND_PIZZA";
interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	colour: COLOURS.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduct: number;
}
export type Employee = ManagementEmployee | FoodEmployee;

