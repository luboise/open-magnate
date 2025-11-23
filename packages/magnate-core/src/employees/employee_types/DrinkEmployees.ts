import {
	BaseEmployee,
	EmployeeColour,
	EmployeeCreationData
} from "../EmployeeTypes";

import { Reach } from "../../Reach";
import { DrinkType, Supply } from "../../demand/Supply";

export interface DrinkEmployee extends BaseEmployee {
	type: "DRINK";
	id: DrinkEmployeeId;
	colour: EmployeeColour.LIGHT_GREEN;
	/// How much this employee can produce regardless of distance
	supply?: Supply<DrinkType[]>;
	reach?: Reach;
}
export const DRINK_EMPLOYEE_IDS = [
	"drink_boy",
	"drink_cart",
	"drink_truck",
	"drink_zeppelin"
] as const;

export type DrinkEmployeeId =
	(typeof DRINK_EMPLOYEE_IDS)[number];

export const DrinkEmployees: Record<
	DrinkEmployeeId,
	DrinkEmployee
> = {
	drink_boy: createDrinkEmployee({
		id: "drink_boy",
		name: "Errand Boy",
		supply: {
			demand_type: ["LEMONADE", "COLA", "BEER"],
			amount: 1
		},
		notPaid: true,
		buildsInto: ["drink_cart"]
	}),
	drink_cart: createDrinkEmployee({
		id: "drink_cart",
		name: "Cart Operator",
		reach: {
			distance: 2,
			reach_type: "ROAD"
		},
		buildsInto: ["drink_truck"]
	}),
	drink_truck: createDrinkEmployee({
		id: "drink_truck",
		name: "Truck Driver",
		reach: {
			distance: 3,
			reach_type: "ROAD"
		},

		buildsInto: ["drink_zeppelin"]
	}),
	drink_zeppelin: createDrinkEmployee({
		id: "drink_zeppelin",
		name: "Zeppelin Pilot",
		reach: {
			distance: 4,
			reach_type: "AIR"
		},
		buildsInto: [],
		oneOf: true
	})
} as const;

export function createDrinkEmployee(
	data: EmployeeCreationData<DrinkEmployee>
): DrinkEmployee {
	return {
		type: "DRINK",
		colour: EmployeeColour.LIGHT_GREEN,
		notPaid: Boolean(data.notPaid),
		...data
	};
}
