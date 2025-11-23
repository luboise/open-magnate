import {
	BaseEmployee,
	EMPLOYEE_COLOUR,
	EmployeeCreationData
} from "../EmployeeTypes";

export const MGMT_EMPLOYEE_IDS = [
	"mgmt_1",
	"mgmt_2",
	"mgmt_3",
	"mgmt_4",
	"mgmt_5"
] as const;

export type ManagementEmployeeId =
	(typeof MGMT_EMPLOYEE_IDS)[number];

export interface ManagementEmployee extends BaseEmployee {
	type: "MANAGEMENT";
	id: ManagementEmployeeId;
	colour: EMPLOYEE_COLOUR.BLACK;
	capacity: number;
}

export function createManagementEmployee(
	data: EmployeeCreationData<ManagementEmployee>
): ManagementEmployee {
	return {
		id: data.id,
		name: data.name,
		type: "MANAGEMENT",
		colour: EMPLOYEE_COLOUR.BLACK,
		capacity: data.capacity,
		notPaid: data.notPaid,
		oneOf: data.oneOf,
		buildsInto: []
	};
}

export const ManagementEmployees: Record<
	ManagementEmployeeId,
	ManagementEmployee
> = {
	mgmt_1: createManagementEmployee({
		name: "Management Trainee",
		id: "mgmt_1",
		capacity: 2,
		notPaid: true,
		buildsInto: ["mgmt_2"]
	}),
	mgmt_2: createManagementEmployee({
		name: "Junior Vice President",
		id: "mgmt_2",
		capacity: 3,
		buildsInto: ["mgmt_3"]
	}),
	mgmt_3: createManagementEmployee({
		name: "Vice President",
		id: "mgmt_3",
		capacity: 4,
		buildsInto: ["mgmt_4"]
	}),
	mgmt_4: createManagementEmployee({
		name: "Senior Vice President",
		id: "mgmt_4",
		capacity: 6,
		buildsInto: ["mgmt_5"]
	}),
	mgmt_5: createManagementEmployee({
		name: "Senior Vice President",
		id: "mgmt_5",
		capacity: 10,
		buildsInto: []
	})
} as const;
