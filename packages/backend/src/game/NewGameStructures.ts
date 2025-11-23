import { Clamp } from "../../../frontend/src/utils";
import { PLAYER_DEFAULTS } from "magnate-core";
import {
	DEFAULT_RESERVE_BASE_GAME,
	RESERVE_ONEOF_VALUE,
	Reserve
} from "magnate-core/employees/Reserve";

export function GetNewReserve(
	playerCount: number
): Reserve {
	const defaults =
		PLAYER_DEFAULTS[Clamp(playerCount, 2, 6, true)];

	const NewReserve = Object.fromEntries(
		Object.entries(DEFAULT_RESERVE_BASE_GAME).map(
			([key, value]) => [
				key,
				value === RESERVE_ONEOF_VALUE
					? defaults.limitedEmployeeCards
					: value
			]
		)
	) as Reserve;

	return NewReserve;
}
