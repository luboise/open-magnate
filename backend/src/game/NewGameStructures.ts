import { Clamp } from "../../../frontend/src/utils";
import { PLAYER_DEFAULTS } from "../../../shared";
import { EMPLOYEE_ID } from "../../../shared/EmployeeIDs";

export type Reserve = Record<EMPLOYEE_ID, number>;

const ONEOF_VALUE = -1;

export const DEFAULT_RESERVE_BASE_GAME: Reserve = {
	food_basic: 12,

	burger_1: 6,
	pizza_1: 6,

	burger_2: ONEOF_VALUE,
	pizza_2: ONEOF_VALUE,

	mgmt_1: 12,
	mgmt_2: 12,
	mgmt_3: 6,
	mgmt_4: 6,
	mgmt_5: ONEOF_VALUE
} as const;

export function GetNewReserve(
	playerCount: number
): Reserve {
	const defaults =
		PLAYER_DEFAULTS[Clamp(playerCount, 2, 6, true)];

	const NewReserve = Object.fromEntries(
		Object.entries(DEFAULT_RESERVE_BASE_GAME).map(
			([key, value]) => [
				key,
				value === ONEOF_VALUE
					? defaults.limitedEmployeeCards
					: value
			]
		)
	) as Reserve;

	return NewReserve;
}

