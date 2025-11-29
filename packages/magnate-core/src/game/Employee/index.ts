import { BASE_SALARY } from "../constants";
import { DrinkType, FoodType } from "../demand";
import {
	FoodEmployee,
	FoodEmployees
} from "../demand/FoodEmployee";
import { MarketingEmployees } from "../marketing";
import { MarketingEmployee } from "../marketing/MarketingEmployee";
import { TurnAction } from "../state";
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

import { EmployeeColour } from "./EmployeeColour";

export * from "./EmployeeStructure";

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

	fromType(employeeType: EmployeeType): Employee {
		if (!Employee.isValidType(employeeType))
			throw new Error(
				"Attempted to get invalid employee ID from ById(): " +
					employeeType
			);
		return { ...EmployeesByType[employeeType] };
	},

	canHire(employee: Employee) {
		return (
			employee.department === "MANAGEMENT" ||
			employee.department === "CEO"
		);
	},

	canExecuteActions(
		employee: Employee,
		_playerIndex: number,
		actions: TurnAction[]
	): boolean {
		if (actions.length === 0) {
			return true;
		}

		switch (employee.department) {
			case "CEO": {
				if (actions.length > 1) {
					return false;
				}

				if (actions[0].type !== "RECRUIT") {
					return false;
				}

				break;
			}

			case "RECRUITMENT": {
				if (
					actions.filter(
						(a) => a.type === "RECRUIT"
					).length > employee.hiringSlots
				) {
					return false;
				}

				if (
					actions.filter(
						(a) => a.type === "TRAIN"
					).length > employee.trainingSlots
				) {
					return false;
				}
				break;
			}

			case "FOOD": {
				if (actions.length > 1) {
					return false;
				}

				const action = actions[0];
				if (action.type !== "CREATE_DEMAND") {
					return false;
				}

				if (
					!employee.supply.demand_type.includes(
						action.demand as FoodType
					) ||
					action.amount > employee.supply.amount
				) {
					return false;
				}

				break;
			}

			case "DRINK": {
				if (actions.length > 1) {
					return false;
				}

				const action = actions[0];

				if (employee.supply !== undefined) {
					if (action.type !== "CREATE_DEMAND") {
						return false;
					}

					if (
						!employee.supply.demand_type.includes(
							action.demand as DrinkType
						)
					) {
						return false;
					}
				} else {
					if (action.type !== "GET_DRINKS") {
						return false;
					}

					// TODO: Calculate reach and path here
				}

				break;
			}

			case "WAITRESS": {
				break;
			}
			case "MARKETING": {
				break;
			}
			case "MANAGEMENT": {
			}
		}

		return true;
	},

	getSalaryCost(employees: Employee[]): number {
		if (employees.length === 0) {
			return 0;
		}

		return employees
			.map((e) => (e.notPaid ? 0 : BASE_SALARY))
			.reduce((prev, curr) => prev + curr, 0);
	}
};
