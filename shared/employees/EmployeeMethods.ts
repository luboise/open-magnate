import {
	CEOEmployeeInitial,
	DrinkEmployees,
	FoodEmployees,
	ManagementEmployees,
	MarketingEmployees,
	RecruitmentEmployees,
	WaitressEmployees
} from "./employee_types";
import { Employee, EmployeeId } from "./types";

const EmployeesById: Record<EmployeeId | "CEO", Employee> =
	{
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

export function isValidEmployeeId(
	id: string
): id is EmployeeId {
	return id in EmployeesById;
}

export function EmployeeCanHire(employee: Employee) {
	return (
		employee.type === "MANAGEMENT" ||
		employee.type === "CEO"
	);
}

export function getEmployeeById(id: EmployeeId): Employee {
	if (!isValidEmployeeId(id))
		throw new Error(
			"Attempted to get invalid employee ID from ById(): " +
				id
		);
	return { ...EmployeesById[id] };
}
