import {
	FoodEmployee,
	FoodEmployees
} from "../demand/FoodEmployee";
import { MarketingEmployees } from "../marketing";
import { MarketingEmployee } from "../marketing/MarketingEmployee";
import {
	CEOEmployee,
	CEOEmployeeInitial,
	DrinkEmployee,
	DrinkEmployees,
	EmployeeType,
	ManagementEmployee,
	ManagementEmployees,
	RecruitmentEmployee,
	RecruitmentEmployees,
	WaitressEmployee,
	WaitressEmployees
} from "./employee_types";

export * from "./EmployeeStructure";
export enum EmployeeColour {
	BLACK = "#000000",

	LIGHT_GREEN = "#448055",
	DARK_GREEN = "#008000",
	GREY = "#808080",
	LIGHT_BLUE = "#9bedff",
	PINK = "rgb(165, 100, 225)",
	RECRUITMENT_GREY = "#BEB5B4"
}

export interface BaseEmployee {
	department: EmployeeDepartment;
	employeeType: EmployeeType | "CEO";
	name: string;
	colour: EmployeeColour;
	buildsInto: EmployeeType[];
	notPaid?: boolean;
	oneOf?: boolean;
}

export type EmployeeCreationData<T extends BaseEmployee> =
	Omit<T, "colour" | "department">;

export * from "./employee_types";

export const EmployeesByType: Record<
	EmployeeType | "CEO",
	Employee
> = {
	...ManagementEmployees,
	...DrinkEmployees,
	...FoodEmployees,
	...MarketingEmployees,
	...WaitressEmployees,
	...RecruitmentEmployees,
	CEO: CEOEmployeeInitial
} as const;

export type EmployeeDepartment =
	| "MANAGEMENT"
	| "FOOD"
	| "DRINK"
	| "MARKETING"
	| "WAITRESS"
	| "CEO"
	| "RECRUITMENT";

export type Employee =
	| ManagementEmployee
	| DrinkEmployee
	| FoodEmployee
	| MarketingEmployee
	| CEOEmployee
	| WaitressEmployee
	| RecruitmentEmployee;

export const Employee = {
	/*
	create<T extends Employee>(
		data: Omit<T, "colour" | "department">
	): T {
		return {
			colour: EmployeeColour.GREY,
			department: "FOOD",
			...data
		};
	},
	*/

	isValidType(
		employeeType: string
	): employeeType is EmployeeType {
		return employeeType in EmployeesByType;
	},

	fromId(id: EmployeeType): Employee {
		if (!Employee.isValidType(id))
			throw new Error(
				"Attempted to get invalid employee ID from ById(): " +
					id
			);
		return { ...EmployeesByType[id] };
	},
	canHire(employee: Employee) {
		return (
			employee.department === "MANAGEMENT" ||
			employee.department === "CEO"
		);
	}
};
