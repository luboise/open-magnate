import {
	BaseEmployee,
	EmployeeColour
} from "../EmployeeTypes";

export type CEO_EMPLOYEE_ID = "CEO";

export function createCEOEmployee(
	capacity: number
): CEOEmployee {
	return {
		id: `CEO`,
		name: "CEO",
		type: "CEO",
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
	type: "CEO";
	name: "CEO";
	id: "CEO";
	colour: EmployeeColour.GREY;
	capacity: number;
	notPaid: true;
}
