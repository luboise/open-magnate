import { BaseEmployee, EmployeeColour } from "..";

export type CEO_EMPLOYEE_ID = "CEO";

export function createCEOEmployee(
	capacity: number
): CEOEmployee {
	return {
		employeeType: `CEO`,
		name: "CEO",
		department: "CEO",
		colour: EmployeeColour.GREY,
		capacity: capacity,
		buildsInto: [],
		notPaid: true
	};
}
// function getEmployee() {
// 	if () {
// 		return MANAGEMENT_NAMES[name];
// 	}
// 	if (name in FOOD_NAMES) {
// 		return FOOD_NAMES[name];
// 	}
// 	return null;
// }

export const CEOEmployeeInitial: CEOEmployee =
	createCEOEmployee(3);
export interface CEOEmployee extends BaseEmployee {
	department: "CEO";
	name: "CEO";
	employeeType: "CEO";
	colour: EmployeeColour.GREY;
	capacity: number;
	notPaid: true;
}
