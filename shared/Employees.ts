import {
	EMPLOYEE_ID,
	FOOD_EMPLOYEE_ID,
	MGMT_EMPLOYEE_ID
} from "./EmployeeIDs";
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
	name: string;
	id: MGMT_EMPLOYEE_ID;
	capacity: number;
	notPaid?: boolean;
	oneOf?: boolean;
}
function createManagementEmployee(
	data: ManagementEmployeeCreationData
): ManagementEmployee {
	return {
		id: data.id,
		name: data.name,
		type: "MANAGEMENT",
		colour: COLOURS.BLACK,
		capacity: data.capacity,
		notPaid: data.notPaid,
		oneOf: data.oneOf,
		buildsInto: []
	};
}

interface FoodEmployeeCreationData {
	id: FOOD_EMPLOYEE_ID;
	name: string;
	produces: FOOD_TYPE;
	amountProduced: number;
}
function createFoodEmployee(
	data: FoodEmployeeCreationData
): FoodEmployee {
	return {
		name: data.name,
		id: data.id,
		type: "FOOD",
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
		name: "CEO",
		type: "CEO",
		colour: COLOURS.GREY,
		capacity: capacity,
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
	MGMT_EMPLOYEE_ID,
	ManagementEmployee
> = {
	mgmt_1: createManagementEmployee({
		name: "Management Trainee",
		id: "mgmt_1",
		capacity: 2,
		notPaid: true
	}),
	mgmt_2: createManagementEmployee({
		name: "Junior Vice President",
		id: "mgmt_2",
		capacity: 3
	}),
	mgmt_3: createManagementEmployee({
		name: "Vice President",
		id: "mgmt_3",
		capacity: 4
	}),
	mgmt_4: createManagementEmployee({
		name: "Senior Vice President",
		id: "mgmt_4",
		capacity: 6
	}),
	mgmt_5: createManagementEmployee({
		name: "Senior Vice President",
		id: "mgmt_5",
		capacity: 10
	})
} as const;

export const FoodEmployees: Record<
	FOOD_EMPLOYEE_ID,
	FoodEmployee
> = {
	food_basic: createFoodEmployee({
		id: "food_basic",
		name: "Kitchen Trainee",
		produces: "BURGER_AND_PIZZA",
		amountProduced: 1
	}),
	burger_1: createFoodEmployee({
		id: "burger_1",
		name: "Burger Cook",
		produces: "BURGER",
		amountProduced: 3
	}),
	burger_2: createFoodEmployee({
		id: "burger_2",
		name: "Burger Chef",
		produces: "BURGER",
		amountProduced: 8
	}),
	pizza_1: createFoodEmployee({
		id: "pizza_1",
		name: "Pizza Cook",
		produces: "PIZZA",
		amountProduced: 3
	}),
	pizza_2: createFoodEmployee({
		id: "pizza_2",
		name: "Pizza Chef",
		produces: "PIZZA",
		amountProduced: 8
	})
} as const;

export const EmployeesById: Record<
	EMPLOYEE_ID | "CEO",
	Employee
> = {
	...ManagementEmployees,
	...FoodEmployees,
	CEO: CEOEmployeeInitial
} as const;

export const DEFAULT_EMPLOYEE_ARRAY = ["CEO"];
export const DEFAULT_SERIALISED_EMPLOYEE_STRING =
	"0[X,X,X]";

