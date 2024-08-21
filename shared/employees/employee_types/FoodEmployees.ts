import { BaseEmployee, FOOD_TYPE } from "../EmployeeTypes";
import { EMPLOYEE_COLOUR } from "../EmployeeTypes";

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

export interface FoodEmployeeCreationData {
	id: FOOD_EMPLOYEE_ID;
	name: string;
	produces: FOOD_TYPE;
	amountProduced: number;
	notPaid?: boolean;
}

export function createFoodEmployee(
	data: FoodEmployeeCreationData
): FoodEmployee {
	return {
		name: data.name,
		id: data.id,
		type: "FOOD",
		colour: EMPLOYEE_COLOUR.DARK_GREEN,
		produces: data.produces,
		amountProduced: 0,
		buildsInto: [],
		notPaid: Boolean(data.notPaid)
	};
}

export const FOOD_EMPLOYEE_IDS = [
	"food_basic",
	"burger_1",
	"burger_2",
	"pizza_1",
	"pizza_2"
] as const;

export type FOOD_EMPLOYEE_ID =
	(typeof FOOD_EMPLOYEE_IDS)[number];
export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	id: FOOD_EMPLOYEE_ID;
	colour: EMPLOYEE_COLOUR.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduced: number;
}
export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	id: FOOD_EMPLOYEE_ID;
	colour: EMPLOYEE_COLOUR.DARK_GREEN;
	produces: FOOD_TYPE;
	amountProduced: number;
}
