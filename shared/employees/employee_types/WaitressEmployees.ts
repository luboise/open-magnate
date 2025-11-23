import {
	BaseEmployee,
	EMPLOYEE_COLOUR
} from "../EmployeeTypes";

const WAITRESS_EMPLOYEE_IDS = ["waitress"] as const;

// Will be expanded later with movie star employees
export type WaitressEmployeeId =
	(typeof WAITRESS_EMPLOYEE_IDS)[number];

export interface WaitressEmployee extends BaseEmployee {
	type: "WAITRESS";
	id: WaitressEmployeeId;
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
	WaitressEmployeeId,
	WaitressEmployee
> = {
	waitress: BaseWaitress
} as const;
