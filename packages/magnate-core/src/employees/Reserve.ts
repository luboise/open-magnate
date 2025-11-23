import { EmployeeId } from "./types";

export const RESERVE_ONEOF_VALUE = -1;
export type Reserve = Record<EmployeeId, number>;

export const DEFAULT_RESERVE_BASE_GAME: Reserve = {
	// Food
	food_basic: 12,
	burger_1: 6,
	burger_2: RESERVE_ONEOF_VALUE,
	pizza_1: 6,
	pizza_2: RESERVE_ONEOF_VALUE,

	// Drinks
	drink_boy: 12,
	drink_cart: 6,
	drink_truck: 6,
	drink_zeppelin: 1,

	// Management
	mgmt_1: 18,
	mgmt_2: 12,
	mgmt_3: 6,
	mgmt_4: 6,
	mgmt_5: RESERVE_ONEOF_VALUE,

	// Marketing
	market_1: 12,
	market_2: 6,
	market_3: 6,
	market_4: RESERVE_ONEOF_VALUE,

	// Waitress
	waitress: 12,

	// Recruitment
	trainer: 12,
	coach: 6,
	guru: RESERVE_ONEOF_VALUE,
	recruiting_girl: 12,
	recruiting_manager: 6,
	hr_director: RESERVE_ONEOF_VALUE
} as const;
