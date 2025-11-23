import { DEMAND_TYPE } from "../../backend/src/utils";

export type FoodType = Extract<
	DEMAND_TYPE,
	"BURGER" | "PIZZA"
>;

export type DrinkType = Extract<
	DEMAND_TYPE,
	"LEMONADE" | "BEER" | "COLA"
>;

export type DemandType = FoodType | DrinkType;

export interface Supply<T extends DemandType[]> {
	demand_type: T;
	amount: number;
}
