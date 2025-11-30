import { DrinkTile } from "./demand/DrinkTile";
import { EmployeeType } from "./Employee";
import { MapPiece } from "./map";
import { Position } from "./map/area";
import { RoadTile } from "./map/tiles";
import { HouseTile } from "./map/tiles/HouseTile";

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

// Pieces based on order shown at
// https://www.boardgamehelpers.com/FoodChainMagnate/MapTileKey.aspx
export const BASE_GAME_MAP_PIECES: MapPiece[] = [
	{
		tiles: [
			HouseTile.create(Position.create(0, 3), 2),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(3, 0), 4),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(2, 1), 5),
			...RoadTile.fromGridText(
				"RRRRR RXXXR RXXXR RXXXR RRRRR"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(1, 1), 7),
			...RoadTile.fromGridText(
				"RRRRR RXXXR RXXXR XXXXX XXXXX"
			)
		]
	},
	{
		tiles: [
			DrinkTile.create(Position.create(1, 1), "BEER"),
			HouseTile.create(Position.create(2, 2), 8),
			...RoadTile.fromGridText(
				"RRRXX RXXXX RXXXR XXXXR XXRRR"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(0, 0), 10),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(0, 0), 12),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		tiles: [
			HouseTile.create(Position.create(1, 3), 13),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		// I
		tiles: [
			HouseTile.create(Position.create(3, 3), 15),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		// J
		tiles: [
			HouseTile.create(Position.create(1, 1), 16),
			...RoadTile.fromGridText(
				"XXRRR XXXXR RXXXR RXXXX RRRXX"
			)
		]
	},
	{
		// K
		tiles: [
			HouseTile.create(Position.create(2, 1), 18),
			...RoadTile.fromGridText(
				"RRRRR RXXXR RXXXR XXXXX XXXXX"
			)
		]
	},
	{
		// L
		tiles: [
			DrinkTile.create(
				Position.create(3, 3),
				"LEMONADE"
			),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		// M
		tiles: [
			DrinkTile.create(
				Position.create(3, 1),
				"LEMONADE"
			),
			DrinkTile.create(Position.create(1, 3), "COLA"),
			...RoadTile.fromGridText(
				"XXRRR XXXXR RXXXR RXXXX RRRXX"
			)
		]
	},
	{
		// N
		tiles: [
			DrinkTile.create(Position.create(1, 1), "BEER"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		// O
		tiles: [
			DrinkTile.create(Position.create(1, 0), "BEER"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		// P
		tiles: [
			DrinkTile.create(
				Position.create(0, 1),
				"LEMONADE"
			),
			DrinkTile.create(Position.create(3, 4), "BEER"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		// Q
		tiles: [
			DrinkTile.create(Position.create(1, 3), "COLA"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXXXX XXXXX"
			)
		]
	},
	{
		// R
		tiles: [
			DrinkTile.create(Position.create(1, 1), "COLA"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		// S
		tiles: [
			DrinkTile.create(Position.create(3, 0), "COLA"),
			DrinkTile.create(Position.create(0, 0), "BEER"),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	},
	{
		// T
		tiles: [
			DrinkTile.create(
				Position.create(1, 1),
				"LEMONADE"
			),
			...RoadTile.fromGridText(
				"XXRXX XXRXX RRRRR XXRXX XXRXX"
			)
		]
	}
] as const;
