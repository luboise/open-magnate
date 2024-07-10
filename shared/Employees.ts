import {
	FOOD_EMPLOYEE_NAME,
	MGMT_EMPLOYEE_NAME
} from "./EmployeeNames";
import {
	CEOEmployee,
	Employee,
	FOOD_TYPE,
	FoodEmployee,
	ManagementEmployee
} from "./EmployeeTypes";

export enum COLOURS {
	BLACK = "#000000",
	DARK_GREEN = "#008000",
	GREY = "#808080"
}

function createManagementEmployees(
	inData: ManagementEmployeeCreationData[]
): ManagementEmployee[] {
	return inData.map(createManagementEmployee);
}

interface ManagementEmployeeCreationData {
	name: MGMT_EMPLOYEE_NAME;
	capacity: number;
	notPaid?: boolean;
	oneOf?: boolean;
}
function createManagementEmployee(
	data: ManagementEmployeeCreationData
): ManagementEmployee {
	return {
		name: data.name,
		type: "MANAGEMENT",
		id: `mgmt_${data.capacity}`,
		colour: COLOURS.BLACK,
		capacity: data.capacity,
		notPaid: data.notPaid,
		oneOf: data.oneOf,
		buildsInto: []
	};
}

interface FoodEmployeeCreationData {
	name: FOOD_EMPLOYEE_NAME;
	produces: FOOD_TYPE;
	amountProduced: number;
}
function createFoodEmployee(
	data: FoodEmployeeCreationData
): FoodEmployee {
	return {
		name: data.name,
		type: "FOOD",
		id: `food_${data.produces}`,
		colour: COLOURS.DARK_GREEN,
		produces: data.produces,
		amountProduced: 0,
		buildsInto: []
	};
}

export function createCEOEmployee(
	capacity: number
): CEOEmployee {
	return {
		id: `CEO`,
		colour: COLOURS.GREY,
		capacity: capacity,
		hires: 1,
		name: "CEO",
		type: "CEO",
		buildsInto: []
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

export const ManagementEmployees: Record<
	string,
	ManagementEmployee
> = {
	mgmt_1: createManagementEmployee({
		name: "Management Trainee",
		capacity: 2,
		notPaid: true
	}),
	mgmt_2: createManagementEmployee({
		name: "Junior Vice President",
		capacity: 3
	}),
	mgmt_3: createManagementEmployee({
		name: "Vice President",
		capacity: 4
	}),
	mgmt_4: createManagementEmployee({
		name: "Senior Vice President",
		capacity: 6
	}),
	mgmt_5: createManagementEmployee({
		name: "Senior Vice President",
		capacity: 10
	})
} as const;

export const FoodEmployees: Record<string, FoodEmployee> = {
	food_1: createFoodEmployee({
		name: "Kitchen Trainee",
		produces: "BURGER_AND_PIZZA",
		amountProduced: 1
	}),
	burger_1: createFoodEmployee({
		name: "Burger Cook",
		produces: "BURGER",
		amountProduced: 3
	}),
	burger_2: createFoodEmployee({
		name: "Burger Chef",
		produces: "BURGER",
		amountProduced: 8
	}),
	pizza_1: createFoodEmployee({
		name: "Pizza Cook",
		produces: "PIZZA",
		amountProduced: 3
	}),
	pizza_2: createFoodEmployee({
		name: "Pizza Chef",
		produces: "PIZZA",
		amountProduced: 8
	})
} as const;

export const EmployeesById: Record<string, Employee> = {
	...ManagementEmployees,
	...FoodEmployees,
	CEO: CEOEmployeeInitial
} as const;

export const DEFAULT_EMPLOYEE_ARRAY = ["CEO"];
export const DEFAULT_SERIALISED_EMPLOYEE_STRING =
	"0[X,X,X]";
