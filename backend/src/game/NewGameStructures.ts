import { Clamp } from "../../../frontend/src/utils";
import { PLAYER_DEFAULTS } from "../../../shared";
import { EMPLOYEE_NAME } from "../../../shared/EmployeeNames";

export type Reserve = Record<EMPLOYEE_NAME, number>;

const ONEOF_VALUE = -1;

export const DEFAULT_RESERVE_BASE_GAME: Reserve = {
	"Kitchen Trainee": 12,

	"Burger Cook": 6,
	"Pizza Cook": 6,

	"Burger Chef": ONEOF_VALUE,
	"Pizza Chef": ONEOF_VALUE,

	"Management Trainee": 12,
	"Junior Vice President": 12,
	"Vice President": 6,
	"Senior Vice President": 6,
	"Executive Vice President": ONEOF_VALUE
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

