import { ReduceTupleArray } from "../utils";
import { GamePlayerViewPrivate } from "../views";
import {
	DemandRecord,
	DemandType,
	DemandTypes
} from "./Supply";

export function New(): DemandRecord {
	const tuples = DemandTypes.map(
		(val): [DemandType, number] => [val, 0]
	);
	return ReduceTupleArray(tuples);
}

export function FromPlayer(
	player: GamePlayerViewPrivate
): DemandRecord {
	return FromDemands(player.supply);
}

export function FromDemands(
	demands: DemandType[]
): DemandRecord {
	const tuples = DemandTypes.map<[DemandType, number]>(
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
