import { EmployeeType } from "./Employee";

export const DEFAULT_EMPLOYEE_ARRAY: (
	| EmployeeType
	| "CEO"
)[] = ["CEO"] as const;

export const DEFAULT_SERIALISED_EMPLOYEE_STRING =
	"0[X,X,X]";

export const MAX_PLAYER_COUNT = 5; // const MAX_PLAYER_COUNT = 5;
// const VALID_PLAYER_COUNTS = [2, 3, 4, 5];

export type PlayerCount = 2 | 3 | 4 | 5;

export const PLAYER_DEFAULTS: Record<
	PlayerCount,
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
} as const;
export interface PlayerNumDefault {
    /// Number of map pieces horizontally
    mapWidth: number;
    /// Number of map pieces vertically
    mapHeight: number;

    marketingUnused: Set<number>;
    limitedEmployeeCards: number;
}

