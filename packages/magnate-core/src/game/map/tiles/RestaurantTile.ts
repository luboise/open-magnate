import { BaseMapTile } from "..";
import { Position } from "../area";

export const EntranceCorners = [
	"TOP_LEFT",
	"TOP_RIGHT",
	"BOTTOM_RIGHT",
	"BOTTOM_LEFT"
] as const;
export type EntranceCorner =
	(typeof EntranceCorners)[number];

export interface RestaurantTile extends BaseMapTile {
	tileType: "RESTAURANT";
	ownerIndex: number;
	openingSoon: boolean;

	width: 2;
	height: 2;
	rotation: 0;
}

export const RestaurantTile = {
	create(
		position: Position,
		ownerIndex: number,
		openingSoon: boolean
	): RestaurantTile {
		return {
			ownerIndex,
			openingSoon,
			position,

			// Default params
			tileType: "RESTAURANT",
			width: 2,
			height: 2,
			rotation: 0
		};
	}
};

export function rotateEntranceCorner(
	corner: EntranceCorner,
	inverted: boolean = false
): EntranceCorner {
	switch (corner) {
		case "TOP_LEFT":
			return inverted ? "BOTTOM_LEFT" : "TOP_RIGHT";
		case "TOP_RIGHT":
			return inverted ? "TOP_LEFT" : "BOTTOM_RIGHT";
		case "BOTTOM_RIGHT":
			return inverted ? "TOP_RIGHT" : "BOTTOM_LEFT";
		case "BOTTOM_LEFT":
			return inverted ? "BOTTOM_RIGHT" : "TOP_LEFT";
	}
}
