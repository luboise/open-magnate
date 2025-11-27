import { BaseMapTile } from "..";
import { Position } from "../area";

export const EntranceCorners = [
	"TOPLEFT",
	"TOPRIGHT",
	"BOTTOMRIGHT",
	"BOTTOMLEFT"
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
		case "TOPLEFT":
			return inverted ? "BOTTOMLEFT" : "TOPRIGHT";
		case "TOPRIGHT":
			return inverted ? "TOPLEFT" : "BOTTOMRIGHT";
		case "BOTTOMRIGHT":
			return inverted ? "TOPRIGHT" : "BOTTOMLEFT";
		case "BOTTOMLEFT":
			return inverted ? "BOTTOMRIGHT" : "TOPLEFT";
	}
}
