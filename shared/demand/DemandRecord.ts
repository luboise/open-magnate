import {
	DEMAND_TYPE,
	DEMAND_VALUES,
	GamePlayerViewPrivate,
	ReduceTupleArray
} from "../../backend/src/utils";
import { DemandRecord } from "./types";

export function New(): DemandRecord {
	const tuples = DEMAND_VALUES.map(
		(val): [DEMAND_TYPE, number] => [val, 0]
	);
	return ReduceTupleArray(tuples);
}

export function FromPlayer(
	player: GamePlayerViewPrivate
): DemandRecord {
	return FromDemands(player.supply);
}

export function FromDemands(
	demands: DEMAND_TYPE[]
): DemandRecord {
	const tuples = DEMAND_VALUES.map<[DEMAND_TYPE, number]>(
		(demand) => [
			demand,
			demands.reduce(
				(sum, playerDemand) =>
					sum + (playerDemand === demand ? 1 : 0),
				0
			)
		]
	);

	return ReduceTupleArray(tuples);
}
