export const DrinkTypes = [
	"LEMONADE",
	"BEER",
	"COLA"
] as const;
export type DrinkType = (typeof DrinkTypes)[number];

export const FoodTypes = ["BURGER", "PIZZA"] as const;
export type FoodType = (typeof FoodTypes)[number];

export const DemandTypes = [
	...FoodTypes,
	...DrinkTypes
] as const;
export type DemandType = (typeof DemandTypes)[number];

export interface Supply<T extends DemandType[]> {
	demand_type: T;
	amount: number;
}

