import { EmployeeId, EmployeeType } from "./types";

export interface BaseEmployee {
	id: EmployeeId | "CEO";
	name: string;

	type: EmployeeType;
	colour: EMPLOYEE_COLOUR;
	buildsInto: EmployeeId[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export enum EMPLOYEE_COLOUR {
	BLACK = "#000000",

	LIGHT_GREEN = "#448055",
	DARK_GREEN = "#008000",
	GREY = "#808080",
	LIGHT_BLUE = "#9bedff",
	PINK = "rgb(165, 100, 225)",
	RECRUITMENT_GREY = "#BEB5B4"
}

export type EmployeeCreationData<T> = Omit<
	T,
	"colour" | "type"
>;
