export interface PlayerNumDefault {
	mapWidth: number;
	mapHeight: number;
	marketingUnused: Set<number>;
	limitedEmployeeCards: number;
}

const MAX_PLAYER_COUNT = 5;
const VALID_PLAYER_COUNTS = [2, 3, 4, 5];

export const PLAYER_DEFAULTS: Record<
	number,
	PlayerNumDefault
> = {
	2: {
		mapWidth: 3,
		mapHeight: 3,
		limitedEmployeeCards: 1,
		marketingUnused: new Set([12, 15, 16])
	},

	3: {
		mapWidth: 4,
		mapHeight: 3,
		limitedEmployeeCards: 1,
		marketingUnused: new Set([15, 16])
	},

	4: {
		mapWidth: 4,
		mapHeight: 4,
		limitedEmployeeCards: 2,
		marketingUnused: new Set([16])
	},

	5: {
		mapWidth: 5,
		mapHeight: 4,
		limitedEmployeeCards: 3,
		marketingUnused: new Set([])
	}

	// 6: {
	// 	mapWidth: 3,
	// 	mapHeight: 3,
	// 	limitedEmployeeCards: 1,
	// 	marketingUnused: new Set([12, 15, 16])
	// }
};

// export type Player = {
// 	playerNum: number;
// 	name: string;
// 	restaurant: number;
// 	money: number;
// 	employees: Array<Employee>;
// 	milestones: Array<Milestone>;
// 	food: Array<Food>;
// };

