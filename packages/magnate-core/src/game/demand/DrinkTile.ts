import { DrinkType } from ".";
import { BaseMapTile } from "../map";
import { Position } from "../map/area";

export interface DrinkTile extends BaseMapTile {
	drinkType: DrinkType;
	width: 1;
	height: 1;
	rotation: 0;
}

export const DrinkTile = {
	create(
		position: Position,
		drinkType: DrinkType
	): DrinkTile {
		return {
			drinkType,
			position,

			tileType: "DRINK",
			width: 1,
			height: 1,
			rotation: 0
		};
	}
};
