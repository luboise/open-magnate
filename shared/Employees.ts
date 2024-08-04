import {
	EMPLOYEE_ID,
	FOOD_EMPLOYEE_ID,
	MARKETING_EMPLOYEE_ID,
	MGMT_EMPLOYEE_ID
} from "./EmployeeIDs";
import {
	CEOEmployee,
	Employee,
	FOOD_TYPE,
	FoodEmployee,
	ManagementEmployee,
	MarketingEmployee,
	MarketingType
} from "./EmployeeTypes";

export enum COLOURS {
	BLACK = "#000000",
	DARK_GREEN = "#008000",
	GREY = "#808080",
	LIGHT_BLUE = "#9bedff"
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
	notPaid?: boolean;
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
		buildsInto: [],
		notPaid: Boolean(data.notPaid)
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
		buildsInto: [],
		notPaid: true
	};
}

interface MarketingEmployeeCreationData {
	name: string;
	id: MARKETING_EMPLOYEE_ID;
	marketingType: MarketingType;
	notPaid?: boolean;
}

export function createMarketingEmployee({
	name,
	id,
	marketingType,
	notPaid = false
}: MarketingEmployeeCreationData): MarketingEmployee {
	return {
		id: id,
		name: name,
		type: "MARKETING",
		colour: COLOURS.LIGHT_BLUE,
		marketingType: marketingType,
		buildsInto: [],
		notPaid: notPaid
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
		amountProduced: 1,
		notPaid: true
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

export const MarketingEmployees: Record<
	MARKETING_EMPLOYEE_ID,
	MarketingEmployee
> = {
	market_1: createMarketingEmployee({
		id: "market_1",
		marketingType: "BILLBOARD",
		name: "Marketing Trainee",
		notPaid: true
	}),
	market_2: createMarketingEmployee({
		id: "market_2",
		marketingType: "MAILBOX",
		name: "Campaign Manager"
	}),
	market_3: createMarketingEmployee({
		id: "market_3",
		marketingType: "PLANE",
		name: "Brand Manager"
	}),
	market_4: createMarketingEmployee({
		id: "market_4",
		marketingType: "RADIO",
		name: "Brand Director"
	})
} as const;

export const EmployeesById: Record<
	EMPLOYEE_ID | "CEO",
	Employee
> = {
	...ManagementEmployees,
	...FoodEmployees,
	...MarketingEmployees,
	CEO: CEOEmployeeInitial
} as const;

export function IsValidEmployeeId(
	id: string
): id is EMPLOYEE_ID {
	return id in EmployeesById;
}

export const DEFAULT_EMPLOYEE_ARRAY = ["CEO"];
export const DEFAULT_SERIALISED_EMPLOYEE_STRING =
	"0[X,X,X]";

export function EmployeeCanHire(employee: Employee) {
	return (
		employee.type === "MANAGEMENT" ||
		employee.type === "CEO"
	);
}

