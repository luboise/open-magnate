import { FoodType, Supply } from "../../demand";
import {
	BaseEmployee,
	EmployeeColour,
	EmployeeCreationData
} from "../EmployeeTypes";

export const FOOD_EMPLOYEE_IDS = [
	"food_basic",
	"burger_1",
	"burger_2",
	"pizza_1",
	"pizza_2"
] as const;

export interface FoodEmployee extends BaseEmployee {
	type: "FOOD";
	id: FoodEmployeeId;
	colour: EmployeeColour.DARK_GREEN;
	supply: Supply<FoodType[]>;
}

export type FoodEmployeeId =
	(typeof FOOD_EMPLOYEE_IDS)[number];

export const FoodEmployees: Record<
	FoodEmployeeId,
	FoodEmployee
> = {
	food_basic: createFoodEmployee({
		id: "food_basic",
		name: "Kitchen Trainee",
		supply: {
			demand_type: ["BURGER", "PIZZA"],
			amount: 1
		},
		notPaid: true,
		buildsInto: ["burger_1", "pizza_1"]
	}),
	burger_1: createFoodEmployee({
		id: "burger_1",
		name: "Burger Cook",
		supply: {
			demand_type: ["BURGER"],
			amount: 3
		},
		buildsInto: ["burger_2"]
	}),
	burger_2: createFoodEmployee({
		id: "burger_2",
		name: "Burger Chef",
		supply: {
			demand_type: ["BURGER"],
			amount: 8
		},
		oneOf: true,
		buildsInto: []
	}),
	pizza_1: createFoodEmployee({
		id: "pizza_1",
		name: "Pizza Cook",
		supply: { demand_type: ["PIZZA"], amount: 3 },
		buildsInto: ["pizza_2"]
	}),
	pizza_2: createFoodEmployee({
		id: "pizza_2",
		name: "Pizza Chef",
		supply: { demand_type: ["PIZZA"], amount: 8 },
		oneOf: true,
		buildsInto: []
	})
} as const;

export function createFoodEmployee(
	data: EmployeeCreationData<FoodEmployee>
): FoodEmployee {
	return {
		name: data.name,
		id: data.id,
		type: "FOOD",
		colour: EmployeeColour.DARK_GREEN,
		supply: { ...data.supply },
		buildsInto: [...data.buildsInto],
		notPaid: Boolean(data.notPaid)
	};
}
