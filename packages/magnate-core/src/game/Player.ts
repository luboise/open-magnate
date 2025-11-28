import { DemandType } from "./demand";
import { DemandRecord } from "./demand/DemandRecord";
import {
	CEOEmployee,
	Employee,
	EmployeeNode
} from "./Employee";

export type Player = {
	money: number;
	demand: DemandRecord;
	employees: Employee[];
	tree: EmployeeNode;
	previousTree: EmployeeNode;
	restaurantIndex: number;
	bankReserveAmount: number;
};

export const Player = {
	create(restaurantIndex) {
		return {
			money: 0,
			demand: DemandRecord.create(),
			employees: [CEOEmployee.create(3)],
			previousTree: { data: 0, children: [] },
			tree: { data: 0, children: [] },
			restaurantIndex,
			bankReserveAmount: 0
		} satisfies Player;
	},

	canSatisfyDemand(player, demand) {
		for (const [key, value] of Object.entries(demand)) {
			if (value <= 0) continue;

			const demandType = key as DemandType;

			// If the player is missing the demand entirely (edge case bug check)
			if (!(demandType in player.demand)) {
				return false;
			}

			// If the player doesn't have enough of a resource bail out
			if (
				player.demand[demandType] <
				demand[demandType]
			) {
				return false;
			}
		}

		return true;
	}
} satisfies {
	create(restaurantIndex: number): Player;

	canSatisfyDemand(
		player: Player,
		demand: DemandRecord
	): boolean;
};
