import { FoodType, Supply } from ".";
import {
	BaseEmployee,
	EmployeeCreationData
} from "../Employee";
import { EmployeeColour } from "../Employee/EmployeeColour";

export const FoodEmployeeTypes = [
	"food_basic",
	"burger_1",
	"burger_2",
	"pizza_1",
	"pizza_2"
] as const;

export type FoodEmployeeType =
	(typeof FoodEmployeeTypes)[number];

export interface FoodEmployee extends BaseEmployee {
	department: "FOOD";
	employeeType: FoodEmployeeType;
	colour: EmployeeColour.DARK_GREEN;
	supply: Supply<FoodType[]>;
}

export const FoodEmployee = {
	create(
		data: EmployeeCreationData<FoodEmployee>
	): FoodEmployee {
		return {
			name: data.name,
			employeeType: data.employeeType,
			department: "FOOD",
			colour: EmployeeColour.DARK_GREEN,
			supply: { ...data.supply },
			buildsInto: [...data.buildsInto],
			notPaid: Boolean(data.notPaid)
		};
	}
};

export const FoodEmployees: Record<
	FoodEmployeeType,
	FoodEmployee
> = {
	food_basic: FoodEmployee.create({
		employeeType: "food_basic",
		name: "Kitchen Trainee",
		supply: {
			demand_type: ["BURGER", "PIZZA"],
			amount: 1
		},
		notPaid: true,
		buildsInto: ["burger_1", "pizza_1"]
	}),
	burger_1: FoodEmployee.create({
		employeeType: "burger_1",
		name: "Burger Cook",
		supply: {
			demand_type: ["BURGER"],
			amount: 3
		},
		buildsInto: ["burger_2"]
	}),
	burger_2: FoodEmployee.create({
		employeeType: "burger_2",
		name: "Burger Chef",
		supply: {
			demand_type: ["BURGER"],
			amount: 8
		},
		oneOf: true,
		buildsInto: []
	}),
	pizza_1: FoodEmployee.create({
		employeeType: "pizza_1",
		name: "Pizza Cook",
		supply: { demand_type: ["PIZZA"], amount: 3 },
		buildsInto: ["pizza_2"]
	}),
	pizza_2: FoodEmployee.create({
		employeeType: "pizza_2",
		name: "Pizza Chef",
		supply: { demand_type: ["PIZZA"], amount: 8 },
		oneOf: true,
		buildsInto: []
	})
} as const;
