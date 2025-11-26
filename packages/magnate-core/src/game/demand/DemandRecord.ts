import { DemandType, DemandTypes } from ".";
import { ReduceTupleArray } from "../../utils";

export type DemandRecord = Record<DemandType, number>;

export const DemandRecord = {
	isEmpty(dr: DemandRecord): boolean {
		return Object.values(dr).every((val) => val <= 0);
	},

	create(): DemandRecord {
		const tuples = DemandTypes.map(
			(val): [DemandType, number] => [val, 0]
		);
		return ReduceTupleArray(tuples);
	},

	fromDemands(demands: DemandType[]): DemandRecord {
		const tuples = DemandTypes.map<
			[DemandType, number]
		>((demand) => [
			demand,
			demands.reduce(
				(sum, playerDemand) =>
					sum + (playerDemand === demand ? 1 : 0),
				0
			)
		]);

		return ReduceTupleArray(tuples);
	}
};
