import { Position } from "../../backend/src/dataViews";

export type RotationAmount = 0 | 90 | 180 | 270;

export interface BaseTile {
	tileType: TileType;
	pos: Position;
	width: number;
	height: number;
	rotation: RotationAmount;
}
export enum TileType {
	EMPTY = "EMPTY",
	ROAD = "ROAD",

	HOUSE = "HOUSE",

	LEMONADE = "LEMONADE",
	COLA = "COLA",
	BEER = "BEER",

	// Overlay Tiles
	MARKETING = "MARKETING",
	RESTAURANT = "RESTAURANT"
}

