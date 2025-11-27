import { BaseEmployee } from "..";
import { EmployeeColour } from "../EmployeeColour";

export type CEO_EMPLOYEE_ID = "CEO";

export interface CEOEmployee extends BaseEmployee {
	department: "CEO";
	name: "CEO";
	employeeType: "CEO";
	colour: EmployeeColour.GREY;
	capacity: number;
	notPaid: true;
}

export const CEOEmployee = {
	create(capacity: number): CEOEmployee {
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
};

export const CEOEmployeeInitial: CEOEmployee =
	CEOEmployee.create(3);
