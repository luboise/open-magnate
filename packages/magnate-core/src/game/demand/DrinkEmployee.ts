import { Reach } from "../map/area";
import {
	BaseEmployee,
	DrinkType,
	EmployeeColour,
	EmployeeCreationData,
    Supply
} from "..";

export interface DrinkEmployee extends BaseEmployee {
	department: "DRINK";
	employeeType: DrinkEmployeeType;
	colour: EmployeeColour.LIGHT_GREEN;
	/// How much this employee can produce regardless of distance
	supply?: Supply<DrinkType[]>;
	reach?: Reach;
}

export const DrinkEmployee = {
	create(
		data: EmployeeCreationData<DrinkEmployee>
	): DrinkEmployee {
		return {
			name: data.name,
			employeeType: data.employeeType,
			department: "DRINK",
			colour: EmployeeColour.LIGHT_GREEN,
			supply: data.supply,
			reach: data.reach,
			buildsInto: [...data.buildsInto],
			notPaid: Boolean(data.notPaid)
		};
	}
};

export const DrinkEmployeeTypes = [
	"drink_boy",
	"drink_cart",
	"drink_truck",
	"drink_zeppelin"
] as const;

export type DrinkEmployeeType =
	(typeof DrinkEmployeeTypes)[number];

export const DrinkEmployees: Record<
	DrinkEmployeeType,
	DrinkEmployee
> = {
	drink_boy: DrinkEmployee.create({
		employeeType: "drink_boy",
		name: "Errand Boy",
		supply: {
			demand_type: ["LEMONADE", "COLA", "BEER"],
			amount: 1
		},
		notPaid: true,
		buildsInto: ["drink_cart"]
	}),
	drink_cart: DrinkEmployee.create({
		employeeType: "drink_cart",
		name: "Cart Operator",
		reach: {
			distance: 2,
			reach_type: "ROAD"
		},
		buildsInto: ["drink_truck"]
	}),
	drink_truck: DrinkEmployee.create({
		employeeType: "drink_truck",
		name: "Truck Driver",
		reach: {
			distance: 3,
			reach_type: "ROAD"
		},

		buildsInto: ["drink_zeppelin"]
	}),
	drink_zeppelin: DrinkEmployee.create({
		employeeType: "drink_zeppelin",
		name: "Zeppelin Pilot",
		reach: {
			distance: 4,
			reach_type: "AIR"
		},
		buildsInto: [],
		oneOf: true
	})
} as const;



