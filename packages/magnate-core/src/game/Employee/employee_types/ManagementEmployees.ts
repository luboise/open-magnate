import {
	BaseEmployee,
	EmployeeColour,
	EmployeeCreationData
} from "..";

export const ManagementEmployeeTypes = [
	"mgmt_1",
	"mgmt_2",
	"mgmt_3",
	"mgmt_4",
	"mgmt_5"
] as const;

export type ManagementEmployeeType =
	(typeof ManagementEmployeeTypes)[number];

export interface ManagementEmployee extends BaseEmployee {
	department: "MANAGEMENT";
	employeeType: ManagementEmployeeType;
	colour: EmployeeColour.BLACK;
	capacity: number;
}

export function createManagementEmployee(
	data: EmployeeCreationData<ManagementEmployee>
): ManagementEmployee {
	return {
		employeeType: data.employeeType,
		name: data.name,
		department: "MANAGEMENT",
		colour: EmployeeColour.BLACK,
		capacity: data.capacity,
		notPaid: data.notPaid,
		oneOf: data.oneOf,
		buildsInto: []
	};
}

export const ManagementEmployees: Record<
	ManagementEmployeeType,
	ManagementEmployee
> = {
	mgmt_1: createManagementEmployee({
		name: "Management Trainee",
		employeeType: "mgmt_1",
		capacity: 2,
		notPaid: true,
		buildsInto: ["mgmt_2"]
	}),
	mgmt_2: createManagementEmployee({
		name: "Junior Vice President",
		employeeType: "mgmt_2",
		capacity: 3,
		buildsInto: ["mgmt_3"]
	}),
	mgmt_3: createManagementEmployee({
		name: "Vice President",
		employeeType: "mgmt_3",
		capacity: 4,
		buildsInto: ["mgmt_4"]
	}),
	mgmt_4: createManagementEmployee({
		name: "Senior Vice President",
		employeeType: "mgmt_4",
		capacity: 6,
		buildsInto: ["mgmt_5"]
	}),
	mgmt_5: createManagementEmployee({
		name: "Senior Vice President",
		employeeType: "mgmt_5",
		capacity: 10,
		buildsInto: []
	})
} as const;
