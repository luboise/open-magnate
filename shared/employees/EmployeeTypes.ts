import { DEMAND_TYPE } from "../../backend/src/dataViews";

import { EMPLOYEE_ID, EMPLOYEE_ENUM } from "./types";

export interface BaseEmployee {
	id: EMPLOYEE_ID | "CEO";
	name: string;

	type: EMPLOYEE_ENUM;
	colour: EMPLOYEE_COLOUR;
	buildsInto: EMPLOYEE_ID[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export type FOOD_TYPE =
	| Extract<DEMAND_TYPE, "BURGER" | "PIZZA">
	| "BURGER_AND_PIZZA";

export enum EMPLOYEE_COLOUR {
	BLACK = "#000000",
	DARK_GREEN = "#008000",
	GREY = "#808080",
	LIGHT_BLUE = "#9bedff",
	PINK = "#111111"
}
