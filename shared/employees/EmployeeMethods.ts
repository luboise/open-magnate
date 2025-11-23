import {
	CEOEmployeeInitial,
	DrinkEmployees,
	FoodEmployees,
	ManagementEmployees,
	MarketingEmployees,
	RecruitmentEmployees,
	WaitressEmployees
} from "./employee_types";
import { EMPLOYEE_ID, EmployeeType } from "./types";

const EmployeesById: Record<
	EMPLOYEE_ID | "CEO",
	EmployeeType
> = {
	...ManagementEmployees,
	...DrinkEmployees,
	...FoodEmployees,
	...MarketingEmployees,
	...WaitressEmployees,
	...RecruitmentEmployees,
	CEO: CEOEmployeeInitial
} as const;

// function getEmployee() {
// 	if () {
// 		return MANAGEMENT_NAMES[name];
// 	}
// 	if (name in FOOD_NAMES) {
// 		return FOOD_NAMES[name];
// 	}
// 	return null;
// }

export function IsValidId(id: string): id is EMPLOYEE_ID {
	return id in EmployeesById;
}

export function EmployeeCanHire(employee: EmployeeType) {
	return (
		employee.type === "MANAGEMENT" ||
		employee.type === "CEO"
	);
}

export function ById(id: EMPLOYEE_ID): EmployeeType {
	if (!IsValidId(id))
		throw new Error(
			"Attempted to get invalid employee ID from ById(): " +
				id
		);
	return { ...EmployeesById[id] };
}
