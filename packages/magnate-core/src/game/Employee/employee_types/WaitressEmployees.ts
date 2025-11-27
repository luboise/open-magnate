import { BaseEmployee } from "..";
import { EmployeeColour } from "../EmployeeColour";

const WAITRESS_EMPLOYEE_IDS = ["waitress"] as const;

// Will be expanded later with movie star employees
export type WaitressEmployeeType =
	(typeof WAITRESS_EMPLOYEE_IDS)[number];

export interface WaitressEmployee extends BaseEmployee {
	department: "WAITRESS";
	employeeType: WaitressEmployeeType;
	colour: EmployeeColour.PINK;
}

const BaseWaitress: WaitressEmployee = {
	employeeType: "waitress",
	colour: EmployeeColour.PINK,

	department: "WAITRESS",
	name: "Waitress",
	buildsInto: []
} as const;

export const WaitressEmployees: Record<
	WaitressEmployeeType,
	WaitressEmployee
> = {
	waitress: BaseWaitress
} as const;
