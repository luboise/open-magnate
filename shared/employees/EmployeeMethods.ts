import {
	CEOEmployeeInitial,
	FoodEmployees,
	ManagementEmployees,
	MarketingEmployees,
	TrainingEmployees,
	WaitressEmployees
} from "./employee_types";
import { EMPLOYEE_ID, EmployeeType } from "./types";

const EmployeesById: Record<
	EMPLOYEE_ID | "CEO",
	EmployeeType
> = {
	...ManagementEmployees,
	...FoodEmployees,
	...MarketingEmployees,
	...WaitressEmployees,
	...TrainingEmployees,
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
// const DRINK_NAMES = [
// 	"Errand Boy",
// 	"Cart Operator",
// 	"Truck Driver",
// 	"Zeppelin Pilot"
// ] as const;
// const TRAINER_NAMES = ["Trainer", "Coach", "Guru"] as const;
// const RECRUITER_NAMES = [
// 	"Recruiting Girl",
// 	"Recruiting Manager",
// 	"HR Director"
// ] as const;
// const PRICER_NAMES = [
// 	"Pricing Manager",
// 	"Luxuries Manager",
// 	"Discount Manager"
// ] as const;
// const RED_NAMES = [
// 	"Local Manager",
// 	"Regional Manager"
// ] as const;
// const PINK_NAMES = ["Waitress", "CEO"] as const;
