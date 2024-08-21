import {
	BaseEmployee,
	EMPLOYEE_COLOUR
} from "../EmployeeTypes";

const WAITRESS_EMPLOYEE_IDS = ["waitress"] as const;

// Will be expanded later with movie star employees
export type WAITRESS_EMPLOYEE_ID =
	(typeof WAITRESS_EMPLOYEE_IDS)[number];

export interface WaitressEmployee extends BaseEmployee {
	type: "WAITRESS";
	id: WAITRESS_EMPLOYEE_ID;
	colour: EMPLOYEE_COLOUR.PINK;
}

const BaseWaitress: WaitressEmployee = {
	id: "waitress",
	colour: EMPLOYEE_COLOUR.PINK,

	type: "WAITRESS",
	name: "Waitress",
	buildsInto: []
} as const;

export const WaitressEmployees: Record<
	WAITRESS_EMPLOYEE_ID,
	WaitressEmployee
> = {
	waitress: BaseWaitress
} as const;
