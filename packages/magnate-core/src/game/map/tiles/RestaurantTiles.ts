import { BaseMapTile } from "..";

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
	owner: number;
	openingSoon: boolean;
	width: 2;
	height: 2;
}

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
